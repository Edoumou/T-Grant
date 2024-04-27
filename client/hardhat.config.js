require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    topos: {
      chainId: Number(process.env.TOPOS_CHAIN_ID),
      url: `${process.env.TOPOS_ENDPOINT}`,
      gasPrice: 2100000,
      //blockGasLimit: 10000000,
      accounts: [
        `${process.env.KEY1}`,
        `${process.env.KEY2}`,
        `${process.env.KEY3}`,
        `${process.env.KEY4}`,
        `${process.env.KEY5}`,
        `${process.env.KEY6}`,
        `${process.env.KEY7}`,
        `${process.env.KEY8}`,
        `${process.env.KEY9}`,
        `${process.env.KEY10}`
      ]
    }
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      },
      viaIR: true
    }
  }
};
