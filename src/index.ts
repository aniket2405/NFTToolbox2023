// import { PathLike } from "fs";
import { Collection as EthereumCollection, LayerSchema as EthereumLayerSchema } from "./classes/chains/EthereumCollection";
import { LayerSchema as SolanaLayerSchema } from "./classes/chains/SolanaCollection";
// import { LayerSchema as TezosLayerSchema } from "./classes/chains/TezosCollection";
// import { Contract as EthereumContract, ContractAttributes, DraftOptions } from "./classes/chains/EthereumContract";
import { Collection as SolanaCollection } from "./classes/chains/SolanaCollection";
import { Contract as SolanaContract, ContractAttributes as solanaContractAttributes, DraftOptions as solanaDraftOptions } from "./classes/chains/SolanaContract";
// import { Collection as TezosCollection } from "./classes/chains/TezosCollection";
// import { Contract as TezosContract } from "./classes/chains/TezosContract";
// import { FileStorage } from "./classes/fileStorage/FileStorage";
// import { execSync } from "child_process";
// import { Arweave } from "./classes/fileStorage/Arweave";
// import { Infura } from "./classes/fileStorage/Infura";
// import { Storj } from "./classes/fileStorage/Storj";
// import { NFTstorage } from "./classes/fileStorage/NFTstorage";
// import { Pinata } from "./classes/fileStorage/Pinata";
import { Keypair, Connection, Account, PublicKey } from '@solana/web3.js';
// import { connect } from "http2";
// import { program } from "@project-serum/anchor/dist/cjs/native/system";
import flatted from 'flatted';

// Create a new connection to the Solana cluster
const connection = new Connection('https://api.devnet.solana.com', 'singleGossip');

        // Create a new Keypair object for the payer
const payer = Keypair.generate();

import { PathLike } from "fs";
import { Collection, LayerSchema } from "./classes/chains/EthereumCollection";
import { Contract as EthereumContract, ContractAttributes as ethereumContractAttributes, DraftOptions as ethereumDraftOptions } from "./classes/chains/EthereumContract";
import { FileStorage } from "./classes/fileStorage/FileStorage";
import { execSync } from "child_process";
import { Arweave } from "./classes/fileStorage/Arweave";
import { Infura } from "./classes/fileStorage/Infura";
import { Storj } from "./classes/fileStorage/Storj";
import { NFTstorage } from "./classes/fileStorage/NFTstorage";
import { Pinata } from "./classes/fileStorage/Pinata";

class Toolbox {
    private solanaCollection: SolanaCollection | undefined = undefined;
	private ethereumcollection: Collection | undefined = undefined;
	private fileStorageService: FileStorage | undefined = undefined;
	private ethereumcontract: EthereumContract | undefined = undefined;
    private solanacontract: SolanaContract | undefined = undefined;

    initEthereumContract(attr: ethereumContractAttributes) {
        this.ethereumcontract = new EthereumContract(attr);
    }

    draftEthereumContract(options: ethereumDraftOptions) {
        if (!this.ethereumcontract) {
            throw new Error("No Ethereum Contract is initialized");
        }
        this.ethereumcontract.draft(options);
    }

    initSolanaContract(attr: solanaContractAttributes) {
        this.solanacontract = new SolanaContract(attr);
    }

    draftSolanaContract(options: solanaDraftOptions) {
        if (!this.solanacontract) {
            throw new Error("No Ethereum Contract is initialized");
        }
        this.solanacontract.draft(options);
    }

	initEthereumCollection(attr: { name: string; dir: string; description?: string }) {
		this.ethereumcollection = new EthereumCollection({
			name: attr.name,
			dir: attr.dir,
			description: attr.description ? attr.description : "",
		});
	}

    initSolanaCollection(attr: { name: string; dir: string; description?: string; programId: PublicKey; account: PublicKey }) {
        this.solanaCollection = new SolanaCollection({
            name: attr.name,
            dir: attr.dir,
            description: attr.description ? attr.description : "",
            programId: attr.programId,
            account: attr.account,
            // flatted.parse(flatted.stringify({ name: 'My NFT Collection', symbol: 'NFT' })),
        });
    }

	generateEthereumNFTs(schema: EthereumLayerSchema) {
        if (!this.ethereumcollection) {
            throw new Error("No Ethereum Collection is initialized");
        }
        this.ethereumcollection.setSchema(schema);
        this.ethereumcollection.generate();
    }

    generateSolanaNFTs(schema: SolanaLayerSchema) {
        if (!this.solanaCollection) {
            throw new Error("No Solana Collection is initialized");
        }
        this.solanaCollection.setSchema(schema);
        this.solanaCollection.generate();
    }


	initFileStorageService(attr: {
		service: string;
		key?: string;
		secret?: string;
		username?: string;
		password?: string;
		currency?: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		wallet?: any;
	}) {
		switch (attr.service) {
			case "arweave":
				if (!attr.wallet || !attr.currency) {
					throw new Error("Arweave Currency and Wallet required");
				}
				execSync(
					"npm install @bundlr-network/client bignumber.js mime @types/mime",
					{ stdio: [0, 1, 2] }
				);
				this.fileStorageService = new Arweave(
					attr.currency,
					attr.wallet
				);
				break;

			case "storj":
				if (!attr.username) {
					throw new Error("STORJ Username required");
				}
				if (!attr.password) {
					throw new Error("STORJ Password required");
				}
				execSync("npm install ndjson-parse", {
					stdio: [0, 1, 2],
				});
				this.fileStorageService = new Storj(
					attr.username,
					attr.password
				);
				break;

			case "infura":
				if (!attr.username) {
					throw new Error("INFURA Username required");
				}
				if (!attr.password) {
					throw new Error("INFURA Password required");
				}
				execSync("npm install ndjson-parse", {
					stdio: [0, 1, 2],
				});
				this.fileStorageService = new Infura(
					attr.username,
					attr.password
				);
				break;
			case "pinata":
				if (!attr.key || !attr.secret) {
					throw new Error("Pinata API Key and Security required");
				}
				execSync("npm install @pinata/sdk", { stdio: [0, 1, 2] });
				this.fileStorageService = new Pinata(attr.key, attr.secret);
				break;

			case "nft.storage":
				if (!attr.key) {
					throw new Error("NFT Storage API Key required");
				}
				execSync("npm install nft.storage files-from-path", {
					stdio: [0, 1, 2],
				});
				this.fileStorageService = new NFTstorage(attr.key);
				break;

			default:
				throw new Error("Unknown File Storage Service");
		}
	}

    // For Ethereum

	async uploadEthereumCollectionNFT() {
		if (!this.ethereumcollection) {
			throw new Error("No Collection is initialized");
		}
		if (!this.fileStorageService) {
			throw new Error("No File Storage Service is initialized");
		}
		const response = await this.fileStorageService.uploadEthereumCollection(
			this.ethereumcollection
		);
		return response;
	}

    // For Solana

    async uploadSolanaCollectionNFT() {
		if (!this.solanaCollection) {
			throw new Error("No Collection is initialized");
		}
		if (!this.fileStorageService) {
			throw new Error("No File Storage Service is initialized");
		}
		const response = await this.fileStorageService.uploadSolanaCollection(
			this.solanaCollection
		);
		return response;
	}

	// @eslint-disable-next-line @typescript-eslint/no-explicit-any
	async uploadSingleNFT(asset: PathLike, metadata: any) {
		if (!this.fileStorageService) {
			throw new Error("No File Storage Service is initialized");
		}
		const response = await this.fileStorageService.uploadSingle(
			asset,
			metadata
		);
		return response;
	}

	deployEthereumContract() {
		if (!this.ethereumcontract) {
			throw new Error("No Contract is initialized");
		}
		this.ethereumcontract.deploy();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async readEthereumContract(method: string, args: any[]) {
		if (!this.ethereumcontract) {
			throw new Error("No Contract is initialized");
		}
		const res = await this.ethereumcontract.read(method, args);
		return res;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async writeEthereumContract(method: string, args: any[]) {
		if (!this.ethereumcontract) {
			throw new Error("No Contract is initialized");
		}
		const tx = await this.ethereumcontract.write(method, args);
		return tx;
	}
}

export const nftToolbox = new Toolbox();