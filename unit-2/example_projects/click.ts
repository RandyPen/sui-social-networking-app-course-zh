import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
});

const mnemonics: string = "zero zero zero zero zero zero zero zero zero zero zero zero";
const keypair = Ed25519Keypair.deriveKeypair(mnemonics);
const address = keypair.toSuiAddress();

// const object_list = await client.getOwnedObjects({owner: address});
const struct_type = "0xf88ed6fdffa373a09a1a54fbad1ac4730219142f7fa798bdcf632d5f159e4a18::profile_clock::Profile";
const object_list = await client.getOwnedObjects({ owner: address, filter: { StructType: struct_type } });
const profile_id = object_list.data[0].data!.objectId;

const PACKAGE: string = '0xf88ed6fdffa373a09a1a54fbad1ac4730219142f7fa798bdcf632d5f159e4a18';
const tx = new Transaction();
tx.moveCall({
    package: PACKAGE,
    module: "profile_clock",
    function: "click",
    arguments: [
        tx.object(profile_id),
        tx.object("0x6"),
    ],
});
const result = await client.signAndExecuteTransaction({ signer: keypair, transaction: tx });
console.log(result);