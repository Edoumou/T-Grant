<div align="center">
  <h3 style="font-size: 2em; font-weight: bolder">
        Topos Community Fund - Interest Rate Swaps
  </h3>
  <p style="font-size: calc(10px + 0.9vmin)">
    Tokenize Interest Rate Swaps (IRS) with the help of Blockchain technology
  </p>
</div>
<br>

## Description

This project demonstrates the deployment and management of Interest Rate Swaps through ERC7586. The following functionalities have been implemented

- ERC-7586 Interface: This provides an implementation of the ERC-7586 standard interface.
- Interest Rate Swap Contract: A contract designed for managing IRS.
- IRS Contracts Deployer: A contract used for deploying IRS contracts.
- IRS Call Contract: A contract used for making calls to IRS contracts.
- Investment Bank Contract: A contract for managing issuers, investors, deals and IRS life cycle

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

The `Bonds.js` test scripts implements tests for both `bonds` and `IRS` tokenization. 

## Lauch the Dapp

To launch the Dapp, you first need to add the Topos to your Metamask, [check here](https://docs.topos.technology/content/module-2/1-ERC20-Messaging.html). Once Topos subnet is added to Metamask, run the following command in `/client` folder

```
    npm start
```

## What is a IRS

An interest rate swap is a financial derivative contract between two parties where they agree to exchange interest rate cash flows over a specified period of time. In essence, it allows two parties to exchange interest rate payments to hedge against or speculate on changes in interest rates.

Interest rate swaps are often used by companies to manage their interest rate exposure, by financial institutions to hedge against interest rate risk, or by investors to speculate on interest rate movements. They are widely used in the financial markets for risk management and investment purposes.


## How IRS Work

Here's how it typically works: let's say Party A has a loan with a fixed interest rate, but prefers a floating rate, while Party B has a loan with a floating rate but prefers a fixed rate. They can enter into an interest rate swap agreement where Party A agrees to pay Party B a fixed interest rate in exchange for receiving a floating interest rate payment. This way, Party A effectively converts its fixed-rate loan into a floating-rate loan, while Party B converts its floating-rate loan into a fixed-rate loan.

## IRS Workflow

All steps from bonds issuance and management defined in the `README.md` file `MUST` be done before. To deploy nad manage tokenized IRS, the following steps have been implemented

- Select the `DEAL` contracts that issuers have agreed to enter into IRS contract. Deals are listed on the platform

- `Deploy the IRS contract: ERC-7586` for the deals selected, and issue `IRS tokens` to the two conterparties.

- The two counterparties `APPROVE` the `swap contract` in order to transfert the amount needed from their wallet during the swap.

- The swap manager Calls the `swap` function from `bank contract` to swap IRS.

## Improvments

Some processes like `calling the swap contract` can be automated. This require to integrate protocols like ChainLink. This cannot be done right now since automation through chainlink require Link tokens on the blockchain used by the Dapp. And at the moment, there is no Link tokens deployed on Topos yet.

The benchmark needs to be fetched from the outside sources through Oracles contract. This can be done with protocols like chainlink. So as said previously, there is no Link tokens deployed on Topos yet, and chainlink doesn't support Topos bmockchain yet.

Another improvment will be to allow IRS swap tokens to be managed accross several blockchains. This is an interesting use case that can be used to test bonds management accros different subnets.