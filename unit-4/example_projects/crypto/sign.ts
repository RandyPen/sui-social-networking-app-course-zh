import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromHex, toHex } from "@mysten/sui/utils";

const secret_key = "9bf49a6a0755f953811fce125f2683d50429c3bb49e074147e0089a52eae155f"
const keypair = Ed25519Keypair.fromSecretKey(fromHex(secret_key));

const msg = new Uint8Array([5, 6, 7]);
const signature = await keypair.sign(msg);
console.log(signature);
