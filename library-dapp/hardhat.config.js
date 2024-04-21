require("@nomicfoundation/hardhat-toolbox");
require('@nomicfoundation/hardhat-ethers');
require("dotenv").config();

module.exports = {
  solidity: '0.8.4',
  paths: {
    artifacts: './frontend/src/artifacts',
  },
  networks: {
    moonbase: {
      url: process.env.MOONBASE_URL,
      chainId: 1287,
      accounts: [`0x` + process.env.PRIVATE_KEY]
    }
  }
};
