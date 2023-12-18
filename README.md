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

The next step is to launch an instance of `Topos Subnet`, and update the `hardhat.config.js` file to include the `Topos Subnet`.

### Include the Topos Subnet in `hardhat.config.js`

To configure the Topos Subnet, we need to add a new network in the `networks` object in `hardhat.config.js`. This network will be called `topos`:

```javascript
  networks: {
    topos: {
      chainId: Number(process.env.TOPOS_CHAIN_ID),
      url: `${process.env.TOPOS_ENDPOINT}`,
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
```

where `chainId` is the Topos sunbnet ID, which is `2359`, and `url` is the Topos endpoint `"https://rpc.topos-subnet.testnet-1.topos.technology"`. The `accounts` field is an array that contains private keys that will be used to deploy and sign transactions.

## Contract Compilation and Deployment

To compile and deploy the contract on Topos Subnet, we first need to get some `TOPOS` tokens to pay for the gas fees [Topos Faucet](https://faucet.testnet-1.topos.technology/). Once received, run the following command in `/client` folder

```javascript
    // Run Hardhat Network and keep it running
    $ npx hardhat node

    // Runs the deployment script and initializes contracts addresses
    $ sh deploy.sh 
```

## Tests
To run tests, type the following command in `/client` folder

```
    npx hardhat test test/Bonds.js
```

## Lauch the Dapp

To launch the Dapp, you first need to add the Topos to your Metamask, [check here](https://docs.topos.technology/content/module-2/1-ERC20-Messaging.html). Once Topos subnet is added to Metamask, run the following command in `/client` folder

```
    npm start
```

## What is a Bond

A bond is a fixed income instrument that represents a loan made by an investor to a borrower. Bonds are used by companies and governments to borrow money from investors. A bond usually pays interests at regular interval of time, and repays the principal invested at maturity. Each bond must specify the coupon -the interests that investors will be earning-, and the maturity date -the date when the bond will mature-. Some bonds don't pay interests. In that case, the bond is sold at discount to allow investors make a profit.

## How Bonds Work

Traditionally, when a company wants to issue bonds, they hire an investment bank that arranges the deal, issues bonds to investors and transfers the funds to the issuer.

Tokenized bonds are representation of debt issued on the blockchain as a token. Unlike bonds issued in a traditional way where their management is delegated to brokers and custodies, tokenized bonds are held by investors in their wallet. Investors are then responsible for the management of their tokens, lowering then costs related to fees from these entities.

## Tokenized Bonds Workflow

To issue nad manage tokenized bonds, the following steps have been implemented

- Register a `Bond Manager` account. The bond manager account is responsible of executing some operations like `issuing bonds`, to investors `redeeming bonds`, `approving a deal`, etc.

- Register `issuers` and `investors`. This process simulates the registration of users to an Identity Registry. Only registered accounts can issue or invest in tokenized bonds.

- Submit a registration request to register an account as either `issuer` or `investor`.

- The `bond manager` approves or reject users request to become either issuer or investor.

- Approved accounts as `issuer` can submit a `deal` with a link to the `deal prospectus`.

- If the deal is `approved` then registered `investors` can invest on it.

- Investors register to a deal by submitting their investment

- When the `issue volume` is reached, the bond manager `deploy the bond contract: ERC-7092` for the deal, and issue `bond tokens` to investors.

- Investors can now manage their bonds through their wallet.

- Registered investors can `transfer` bonds. They can also `list` a given amount of their bonds on the `Exchange`.

- Bonds listed on the Exchange can be updated by the `seller`. Operations like increasing the amount listed, updating the bond price or cancelling the listing are possible.

- Registered investors can `buy` bonds on the Exchange.

- After `maturity`, the bond manager call the `redeem` function to retire the bonds and repay the principal back to investors.

- The bond manager can call `payInterest` function to pay interest to investors.

- The bond manager is in charge of transferring the `funds` to the issuer. The platform takes a comission fee from each deal.

## Improvments

Some processes like coupon payment and principal repayment can be automated. This require to integrate protocols like ChainLink. This cannot be done right now since automation through chainlink require Link tokens on the blockchain used by the Dapp. And at the moment, there is no Link tokens deployed on Topos yet.

Another improvment will be to allow bonds to be managed accross several blockchains. This is an interesting use case that can be used to test bonds management accros different subnets.
