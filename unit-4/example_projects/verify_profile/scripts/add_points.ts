import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { bcs } from '@mysten/sui/bcs';
import { signMessage } from "./sign";

const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
});

const defaultOptions = {
	showType: true,
	showContent: true,
	showOwner: false,
	showPreviousTransaction: false,
	showStorageRebate: false,
	showDisplay: false,
};

const mnemonics: string = "zero zero zero zero zero zero zero zero zero zero zero zero";
const keypair = Ed25519Keypair.deriveKeypair(mnemonics);
const address = keypair.toSuiAddress();

const struct_type = "0xeae0ae9f148538131e4022fb4e5ec72336a61c10601d26a1957bb02fb7d3da83::profile::Profile";
const object_list = await client.getOwnedObjects({ owner: address, filter: { StructType: struct_type } });
const profile_id = object_list.data[0].data!.objectId;
const profile_info = await client.getObject({ id: profile_id, options: defaultOptions });
const profile_data = profile_info.data!.content!.fields;
const profile_last_time = profile_data.last_time;
const add_points = 10;
const sign_bytedata = await signMessage(profile_id, add_points, profile_last_time);

const PACKAGE: string = '0xeae0ae9f148538131e4022fb4e5ec72336a61c10601d26a1957bb02fb7d3da83';
const tx = new Transaction();
tx.moveCall({
    package: PACKAGE,
    module: "profile",
    function: "add_points",
    arguments: [
        tx.object(profile_id),
        tx.pure(bcs.u64().serialize(add_points).toBytes()),
        tx.pure(bcs.vector(bcs.u8()).serialize(sign_bytedata).toBytes()),
        tx.object("0x6"),
    ],
});
tx.setSender(address);
const dataSentToFullnode = await tx.build({ client: client });
const result = await client.dryRunTransactionBlock({
    transactionBlock: dataSentToFullnode,
});
console.log(result);
