import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
});

const defaultOptions = {
	showType: true,
	showContent: true,
	showOwner: true,
	showPreviousTransaction: true,
	showStorageRebate: true,
	showDisplay: true,
};

const object_id = "0x45bda8a829389098fa988abac7bec9326a2f9fefbf441a74bcdb4198b761fcd0";
const result = await client.getObject({ id: object_id, options: defaultOptions });
const point = result.data?.content?.fields;
console.log(point);
