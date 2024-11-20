import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromHex, toHex } from "@mysten/sui/utils";

const secret_key = "9bf49a6a0755f953811fce125f2683d50429c3bb49e074147e0089a52eae155f"
const keypair = Ed25519Keypair.fromSecretKey(fromHex(secret_key));
console.log(keypair);

const address = keypair.toSuiAddress();
console.log(address);
