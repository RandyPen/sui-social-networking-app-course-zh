import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { bcs } from '@mysten/sui/bcs';

const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
});

const mnemonics: string = "zero zero zero zero zero zero zero zero zero zero zero zero";
const keypair = Ed25519Keypair.deriveKeypair(mnemonics);

const PACKAGE: string = '0xeae0ae9f148538131e4022fb4e5ec72336a61c10601d26a1957bb02fb7d3da83';
const tx = new Transaction();
tx.moveCall({
    package: PACKAGE,
    module: "profile",
    function: "mint",
    arguments: [
        tx.pure(bcs.string().serialize("MyHandle").toBytes()),
    ],
});
const result = await client.signAndExecuteTransaction({ signer: keypair, transaction: tx });
console.log(result);