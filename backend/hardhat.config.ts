import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "solidity-coverage";
import "dotenv/config";
import "./tasks/accounts";
import "@typechain/hardhat";
import "hardhat-deploy";

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/4hsIVy-qgM_64W-RS7KR8"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "701031e8f4a37653be699410a7130eed66927908caef719f8d865a616ca6ed0d"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "4hsIVy-qgM_64W-RS7KR8"

module.exports = {
  defaultNetwork: "hardhat",
    networks: {
      hardhat: {
        chainId: 31337
      },
      localhost: {
          chainId: 31337,
      },
      goerli: {
          url: GOERLI_RPC_URL,
          accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
          saveDeployments: true,
          chainId: 5,
      },
    },

    solidity: {
      compilers: [
        {
          version: "0.8.7",
        },
      ],
    },

    etherscan: {
      apiKey: ETHERSCAN_API_KEY,
    },

    namedAccounts: {
      deployer: {
          default: 0, 
      }
  },
};
