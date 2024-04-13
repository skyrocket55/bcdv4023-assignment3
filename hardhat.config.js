require("@nomicfoundation/hardhat-toolbox");
require('@nomicfoundation/hardhat-ethers');

module.exports = {
  solidity: '0.8.4',
  networks: {
    moonbase: {
      url: process.env.MOONBASE_URL,
      chainId: 1287,
      accounts: [`0x` + process.env.PRIVATE_KEY]
    }
  }
};
