import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

const keypair = Ed25519Keypair.generate();
console.log(keypair);

const address = keypair.toSuiAddress();
console.log(address);

const secret_key = keypair.getSecretKey();
console.log(secret_key);
