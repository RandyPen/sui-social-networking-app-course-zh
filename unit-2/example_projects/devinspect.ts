import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { bcs } from '@mysten/sui/bcs';

const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
});

const address = "0x27644de364b82b301f28968dafd617b5d1da472d5686062cf271b7391d0be140";
const PACKAGE: string = '0xf88ed6fdffa373a09a1a54fbad1ac4730219142f7fa798bdcf632d5f159e4a18';
const profile_id = "0x45bda8a829389098fa988abac7bec9326a2f9fefbf441a74bcdb4198b761fcd0";
const tx = new Transaction();
tx.moveCall({
    package: PACKAGE,
    module: "profile_clock",
    function: "points",
    arguments: [
        tx.object(profile_id),
    ],
});

const res = await client.devInspectTransactionBlock({
    sender: normalizeSuiAddress(address),
    transactionBlock: tx,
});
const value = bcs.u64().parse(new Uint8Array(res?.results?.[0]?.returnValues?.[0]?.[0]!));
console.log(value);
