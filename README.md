<div align="center">
  <h3 style="font-size: 2em; font-weight: bolder">
        Topos Grant - Finacial Bonds Tokenization
  </h3>
  <p style="font-size: calc(10px + 0.9vmin)">
    Issue and manage financial bonds with the help of Blockchain technology
  </p>
</div>

<br>

## Description

This project demonstrates the issuance and management of Financial Bonds through ERC7092. The following functionalities have been implemented

- Identity Registry: This simulates an identity registry.
- ERC-7092 Interface: This provides an implementation of the ERC-7092 standard interface.
- Bond Contract: A contract designed for managing bonds.
- Bond Contracts Deployer: A contract used for deploying bond contracts.
- Bond Call Contract: A contract used for making calls to bond contracts.
- Investment Bank Contract: A contract for managing issuers, investors, deals and bonds life cycle
- Exchange Contract: A contract used for exchanging bonds between two parties.

## Installation

To install the project along with all the dependencies run:
```
$ cd client
$ npm i
```

In some cases you may need to remove the `package-lock.json` in `/client` folder before running the command.

The next step is to launch an instance of `Topos Subnet`, and update the `truffle-config.js` file to include the `Topos Subnet`.

### Launching an Instance of `Topos Subnet` with Ganache

To launch the Topos Subnet we need to install [ganache-cli](https://www.npmjs.com/package/ganache-cli)

```
npm install -g ganache-cli
```

After installing successfully ganache-cli, the Topos Subnet can be launched by running the following command:

```javascript
    ganache -i 2359 --chain.chainId 2359 -p 7545 --server.rpcEndpoint "https://rpc.topos-subnet.testnet-1.topos.technology" -m "YOUR_MNEMONIC"
```

Replace `YOUR_MNEMONIC` by the mnemonic or seed phrase of the wallet you want to use.

The screenshot bellow shows the result of running that command

![RPC](https://github.com/Edoumou/T-Grant/blob/dev/client/assets/topos_sunet.jpeg "topos subnet launced")

### Include the Topos Subnet in `truffle-config.js`

After launching successfully an instance of the topos subnet, we need to configure the subnet in `truffle-config.js` if that's not done already.

In the `networks` section, add a new network called `topos`

```javascript
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
    }
  }
```
if the truffle `HDWalletProvider` is not installed, then run the following command in `/client` folder

```
    npm i @truffle/hdwallet-provider
```

## Contract Compilation and Deployment

To compile and deploy the contract on Topos Subnet, run the following command in `/client` folder

```
    truffle migrate --network topos --reset
```

## Lauch the Dapp

To run the Dapp, you first need to add the Topos to your Metamask, check here [check here](https://docs.topos.technology/content/module-2/1-ERC20-Messaging.html). Once Topos subnet is added to Metamask, run the following command

```
    npm start
```
