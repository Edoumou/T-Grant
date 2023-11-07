const path = require("path");
const HDWalletProvider = require('./client/node_modules/@truffle/hdwallet-provider');

const MNEMONIC = "strong kangaroo exhibit ivory sunny present render click author magic nothing leg";

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    dev: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    topos: {
      provider: () =>
        new HDWalletProvider(MNEMONIC, "https://rpc.topos-subnet.testnet-1.topos.technology"),
        port: 7545,
        network_id: 2359
    },
    incal: {
      provider: () =>
        new HDWalletProvider(MNEMONIC, "https://rpc.incal.testnet-1.topos.technology"),
        port: 7545,
        network_id: 2360
    }
  },
  compilers: {
    solc: {
      version: "0.8.19"
    }
  }

};