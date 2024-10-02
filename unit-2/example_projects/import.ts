import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

const mnemonics: string = "zero zero zero zero zero zero zero zero zero zero zero zero";
const keypair = Ed25519Keypair.deriveKeypair(mnemonics);
console.log(keypair);

const address = keypair.toSuiAddress();
console.log(address);
