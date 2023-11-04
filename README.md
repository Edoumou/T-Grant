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

In some cases you may need to remove the `package-lock.json` in the `/client` directory before running the command.

The next step is to launch an instance of `Topos Blockchain`, and update the `truffle-config.js` file to include the `Topos Network`.

### Launching an Instance of `Topos` with Ganache

To launch the Topos blockchain we need to install [ganache-cli](https://www.npmjs.com/package/ganache-cli)

```
npm install -g ganache-cli
```

After installing successfully ganache-cli, the Topos blockchain can be launched by running the following command:

```javascript
    ganache -i 2359 --chain.chainId 2359 -p 7545 --server.rpcEndpoint "https://rpc.topos-subnet.testnet-1.topos.technology" -m "YOUR_MNEMONIC"
```