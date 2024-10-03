import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
});

const mnemonics: string = "zero zero zero zero zero zero zero zero zero zero zero zero";
const keypair = Ed25519Keypair.deriveKeypair(mnemonics);
const address = keypair.toSuiAddress();

const PACKAGE: string = '0xf88ed6fdffa373a09a1a54fbad1ac4730219142f7fa798bdcf632d5f159e4a18';
const profile_id = "0x45bda8a829389098fa988abac7bec9326a2f9fefbf441a74bcdb4198b761fcd0";
const tx = new Transaction();
const pt = tx.moveCall({
    package: PACKAGE,
    module: "profile_clock",
    function: "points",
    arguments: [
        tx.object(profile_id),
    ],
});
tx.setSender(address);
const dataSentToFullnode = await tx.build({ client: client });
const result = await client.dryRunTransactionBlock({
    transactionBlock: dataSentToFullnode,
});
console.log(result);