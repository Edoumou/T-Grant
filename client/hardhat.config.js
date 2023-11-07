require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    topos: {
      chainId: 2359,
      url: "https://rpc.topos-subnet.testnet-1.topos.technology",
      accounts: ["e8ed4eda65774f262922f813712434e06dab54cbbb7ea178cfae2af99eeecca9"]
    }
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: true
    }
}
};
