import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { bcs } from "@mysten/sui/bcs";

const client = new SuiClient({
    url: getFullnodeUrl("mainnet"),
});
const mnemonics: string = process.env.MNEMONICS!;
const keypair = Ed25519Keypair.deriveKeypair(mnemonics);
const address = keypair.getPublicKey().toSuiAddress();

let recipients: string[] = [
    "0x0", // Example Address
    "0x2", // Example Address
];

const PACKAGE_ID = "0xd307628cef4a882a87bcc7ff58674c490822259594e0e0e25eb5dba4cddebf45";

const tx = new Transaction();
tx.moveCall({
    package: PACKAGE_ID,
    module: "send_gas",
    function: "send_gas",
    arguments: [
        tx.gas,
        tx.pure(bcs.U64.serialize(0.01 * 1_000_000_000)),
        tx.pure(bcs.vector(bcs.Address).serialize(recipients).toBytes()),
    ],
});
tx.setSender(address);

const dataSentToFullnode = await tx.build({ client: client });
const dryRunResult = await client.dryRunTransactionBlock({ transactionBlock: dataSentToFullnode });
console.log(dryRunResult.balanceChanges);

// const result = await client.signAndExecuteTransaction({ signer: keypair, transaction: tx });
// console.log(result);
