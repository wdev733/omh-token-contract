require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();

const DEPLOYER_KEY = process.env.DEPLOYER_KEY || "";
const accounts = [DEPLOYER_KEY];

const INFURA_KEY = process.env.INFURA_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        enabled: false,
        url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
      },
    },
  },
  solidity: {
    version: "0.8.3",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 999999,
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
