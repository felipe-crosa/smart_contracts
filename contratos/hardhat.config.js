require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
require('solidity-coverage');
require('hardhat-contract-sizer');
require('@nomicfoundation/hardhat-chai-matchers');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },  
  paths: {
    sources: "./src",
    tests: "./tests",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/9cc731f777b94ddb9de03e7eda0da3cc",
      accounts: [
        `fb3fbf6c242227eeb0a41aa09beae5970280c8dce4d27e7417d208c137a77e2b`
      ]
    }
  }
};