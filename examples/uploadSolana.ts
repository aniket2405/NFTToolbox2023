import { readFileSync } from "fs";
import path from "path";
import { nftToolbox } from "../src/index";
import { PublicKey } from "@solana/web3.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const account = JSON.parse(
	readFileSync(path.join(__dirname, "account.json")).toString()
);

nftToolbox.initSolanaCollection({
	name: "Demo Collection - Solana",
	dir: path.join(__dirname, "Demo Collection - Solana"),
	description: "This is a demo collection for NFT Toolbox",
    programId: new PublicKey('GaTJYGhopJDKYgWtjoaz2Gyc2sfRmW9v5haqppdtVxx5'),
    account: new PublicKey('GaTJYGhopJDKYgWtjoaz2Gyc2sfRmW9v5haqppdtVxx5'),
});

const uploadCollectionExample = async function () {
	const res = await nftToolbox.uploadSolanaCollectionNFT();
	console.log(res);
};

const demoSingleNftImage = path.resolve(
	__dirname,
	"layers",
	"background",
	"white.png"
);
const demoSingleNftMetadata = {
	name: "Demo Single NFT",
	description: "This is a single demo NFT",
	image: "",
	attributes: [
		{ trait_type: "color", value: "grey" },
		{ trait_type: "rarity", value: "1" },
	],
};

const uploadSingleExample = async function () {
	const res = await nftToolbox.uploadSingleNFT(
		demoSingleNftImage,
		demoSingleNftMetadata
	);
	console.log(res);
};

//////////////////////// Select ONE File Storage Platform ////////////////////////

nftToolbox.initFileStorageService({
	service: "pinata",
	key: account.PINATA_KEY,
	secret: account.PINATA_SECURITY,
});

nftToolbox.initFileStorageService({
	service: "nft.storage",
	key: "38e274d48c07a0f20e52",
});

// nftToolbox.initFileStorageService({
// 	service: "storj",
// 	username: account.STORJ_USERNAME,
// 	password: account.STORJ_PASSWORD,
// });

// nftToolbox.initFileStorageService({
// 	service: "arweave",
// 	currency: account.ARWEAVE_CURRENCY,
// 	wallet: account.ARWEAVE_WALLET,
// });

// nftToolbox.initFileStorageService({
// 	service: "infura",
// 	username: account.INFURA_USERNAME,
// 	password: account.INFURA_PASSWORD,
// });

//////////////////////////////////////////////////////////////////////////////////

uploadCollectionExample();

// uploadSingleExample();
