import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

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
const profile_points = profile_data.points;
const profile_handle = profile_data.handle;
console.log(profile_handle);
console.log(profile_points);
console.log(profile_last_time);