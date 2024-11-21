import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromHex, toHex } from "@mysten/sui/utils";
import { bcs } from '@mysten/sui/bcs';
import { keccak256 } from 'js-sha3';

const secret_key = "9bf49a6a0755f953811fce125f2683d50429c3bb49e074147e0089a52eae155f"
const keypair = Ed25519Keypair.fromSecretKey(fromHex(secret_key));

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

const user_mnemonics: string = "zero zero zero zero zero zero zero zero zero zero zero zero";
const user_keypair = Ed25519Keypair.deriveKeypair(user_mnemonics);
const user_address = user_keypair.toSuiAddress();

const struct_type = "0x6bbc0edf3e0b5699095a717fe1e26ecbed7731cbca419177dc0f4f4b84532235::profile::Profile";
const object_list = await client.getOwnedObjects({ owner: user_address, filter: { StructType: struct_type } });
const profile_id = object_list.data[0].data!.objectId;
const profile_info = await client.getObject({ id: profile_id, options: defaultOptions });
const profile_data = profile_info.data!.content!.fields;
const profile_last_time = profile_data.last_time;
const profile_points = profile_data.points;
const profile_handle = profile_data.handle;
const add_points = 10;

export const signMessage = async(id: string, add_points: number, last_time: number): Promise<Uint8Array> => {
    const profile_data = bcs.struct('Profile', {
        id: bcs.string(),
        add_points: bcs.u64(),
        last_time: bcs.u64(),
    });
    const profile_bytedata = profile_data.serialize({ id: id, add_points: add_points, last_time: last_time }).toBytes();
    console.log(profile_bytedata)
    const hash = keccak256(profile_bytedata);
    console.log(hash)
    const hash_bytes = fromHex(hash);
    const signature_bytes = await keypair.sign(hash_bytes);
    return signature_bytes;
}

const sign_bytedata = await signMessage(profile_id, add_points, profile_last_time);
console.log(sign_bytedata);