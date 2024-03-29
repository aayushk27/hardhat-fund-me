require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const SEPOLIA_RPC_URL =
	process.env.SEPOLIA_RPC_URL ||
	"https://eth-sepolia.g.alchemy.com/v2/your-api-key";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "key";

module.exports = {
	// solidity: "0.8.8",
	solidity: {
		compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
	},
	defaultNetwork: "hardhat",
	networks: {
		sepolia: {
			url: SEPOLIA_RPC_URL,
			accounts: [PRIVATE_KEY],
			chainId: 11155111,
			blockConfirmations: 6,
		},
	},
	gasReporter: {
		enabled: true,
		outputFile: "gas-report.txt",
		noColors: true,
		currency: "INR",
		coinmarketcap: COINMARKETCAP_API_KEY,
		token: "ETH",
	},
	etherscan: {
		apiKey: ETHERSCAN_API_KEY,
	},
	namedAccounts: {
		deployer: {
			default: 0,
		},
		user: {
			default: 1,
		},
	},
};
