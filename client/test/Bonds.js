const { expect } = require("chai");
const hre = require("hardhat");
const Web3 = require('web3');

describe("Tokenized Bonds", async () => {
    let registry;
    let authentication;
    let roles;
    let bondCall;
    let bank;
    let issuer;
    let investor;
    let treasury;
    let funds;
    let factory;
    let usdc;
    let usdt;
    let eurc;
    let eurt;
    let cnyc;
    let cnyt;
    let dai;
    let tokenCall;
    let couponMath;
    let couponPayment;
    let exchange;
    let exchangeStorage;

    let deployer;
    let issuer1;
    let issuer2;
    let investor1;
    let investor2;

    beforeEach(async () => {
        [deployer, issuer1, issuer2, investor1, investor2, ...users] = await hre.ethers.getSigners();

        registry = await hre.ethers.deployContract("IdentityRegistry");
        authentication = await hre.ethers.deployContract("Authentication", [registry.target]);
        roles = await hre.ethers.deployContract("Roles");
        bondCall = await hre.ethers.deployContract("BondCall");
        bank = await hre.ethers.deployContract("ToposBank",
            [
                deployer.address,
                roles.target,
                registry.target,
                bondCall.target,
                350
            ]
        );
        issuer = await hre.ethers.deployContract("Issuer", [bank.target]);
        investor = await hre.ethers.deployContract("Investor", [bank.target]);
        treasury = await hre.ethers.deployContract("ToposTreasury", [bank.target]);
        funds = await hre.ethers.deployContract("IssuersFund",
            [
                bank.target,
                treasury.target
            ]
        );
        factory = await hre.ethers.deployContract("BondFactory", [bank.target]);
        usdc = await hre.ethers.deployContract("USDC");
        usdt = await hre.ethers.deployContract("USDT");
        eurc = await hre.ethers.deployContract("EURC");
        eurt = await hre.ethers.deployContract("EURT");
        cnyc = await hre.ethers.deployContract("CNYC");
        cnyt = await hre.ethers.deployContract("CNYT");
        dai = await hre.ethers.deployContract("DAI");
        tokenCall = await hre.ethers.deployContract("TokenCall");
        couponMath = await hre.ethers.deployContract("CouponMath");
        let CouponPayment = await hre.ethers.getContractFactory("CouponPayment", {
            libraries: {
                CouponMath: couponMath.target
            }
        })
        couponPayment = await CouponPayment.deploy();
        exchange = await hre.ethers.deployContract("Exchange",
            [
                bank.target,
                bondCall.target
            ]
        );
        exchangeStorage = await hre.ethers.deployContract("ExchangeBondsStorage",
            [
                bank.target,
                exchange.target,
                bondCall.target
            ]
        );

        await bank.setIssuerFundContract(funds.target);
        await registry.setAuthenticationContract(authentication.target);
        await registry.registerContract(exchangeStorage.target);
        await roles.setToposContracts(bank.target, issuer, investor);

        await tokenCall.addTokenAddress(usdc.target);
        await tokenCall.addTokenAddress(usdt.target);
        await tokenCall.addTokenAddress(eurc.target);
        await tokenCall.addTokenAddress(eurt.target);
        await tokenCall.addTokenAddress(cnyc.target);
        await tokenCall.addTokenAddress(cnyt.target);
        await tokenCall.addTokenAddress(dai.target);
    });

    it("Checks deployment", async () => {
        let zeroAddress = '0x0000000000000000000000000000000000000000';

        expect(registry.target).not.to.equal(zeroAddress);
        expect(authentication.target).not.to.equal(zeroAddress);
        expect(roles.target).not.to.equal(zeroAddress);
        expect(bondCall.target).not.to.equal(zeroAddress);
        expect(bank.target).not.to.equal(zeroAddress);
        expect(issuer.target).not.to.equal(zeroAddress);
        expect(investor.target).not.to.equal(zeroAddress);
        expect(treasury.target).not.to.equal(zeroAddress);
        expect(funds.target).not.to.equal(zeroAddress);
        expect(factory.target).not.to.equal(zeroAddress);
        expect(usdc.target).not.to.equal(zeroAddress);
        expect(usdt.target).not.to.equal(zeroAddress);
        expect(eurc.target).not.to.equal(zeroAddress);
        expect(eurt.target).not.to.equal(zeroAddress);
        expect(cnyc.target).not.to.equal(zeroAddress);
        expect(cnyt.target).not.to.equal(zeroAddress);
        expect(tokenCall.target).not.to.equal(zeroAddress);
        expect(couponMath.target).not.to.equal(zeroAddress);
        expect(couponPayment.target).not.to.equal(zeroAddress);
        expect(exchange.target).not.to.equal(zeroAddress);
        expect(exchangeStorage.target).not.to.equal(zeroAddress);
    });

    it("Checks Funds contract addresse in Bank", async () => {
        let fundsContract = await bank.issuersFundContract();

        expect(fundsContract).to.equal(funds.target);
    });

    it("Checks Auth contract addresse in Identity Registry", async () => {
        let authContract = await registry.authenticationContract();

        expect(authContract).to.equal(authentication.target);
    });

    it("Checks if the Exchange Bonds Storage can manage bonds", async () => {
        let isVerified = await registry.isVerified(exchangeStorage.target);
        
        expect(isVerified).to.be.true;
    });

    it("Checks addresses in the Roles contract", async () => {
        let banContract = await roles.toposBankContract();
        let issuerContract = await roles.issuerContract();
        let investorContract = await roles.investorContract();

        expect(banContract).to.equal(bank.target);
        expect(issuerContract).to.equal(issuer.target);
        expect(investorContract).to.equal(investor.target);
    });

    it("Sets the Exchange Bonds storage contract address in the Exchange contract", async () => {
        await exchange.setExchangeBondsStorage(exchangeStorage.target);

        let exchangeStorageContract = await exchange.exchangeBondsStorage();

        expect(exchangeStorageContract).to.equal(exchangeStorage.target);
    });

    it("Checks payment tokens addresses in Token Call contract", async () => {
        let tokensAddress = await tokenCall.getTokenAddresses();

        expect(tokensAddress[0]).to.equal(usdc.target);
        expect(tokensAddress[1]).to.equal(usdt.target);
        expect(tokensAddress[2]).to.equal(eurc.target);
        expect(tokensAddress[3]).to.equal(eurt.target);
        expect(tokensAddress[4]).to.equal(cnyc.target);
        expect(tokensAddress[5]).to.equal(cnyt.target);
        expect(tokensAddress[6]).to.equal(dai.target);
    });
    
    it("Registers Topos manager", async () => {
        let authHash = await AuthenticationHash('123456', deployer);
        let identyHash = await RegistrationHash(deployer, 'Manager', '0102030405', 'manager@topos.com');

        await registry.register(identyHash, authHash);
    });

    it("Registers issuers", async () => {

    });

    it("Registers investors", async () => {

    });
});

const AuthenticationHash = async (digiCode, signer) => {
    let signedMessage = await SignData(digiCode, signer);

    let message = digiCode + signer.address;
    let messageHash = hre.ethers.hashMessage(message)

    let hash = hre.ethers.hashMessage(signedMessage + messageHash);

    return hash;
}

const RegistrationHash = async (signer, fullname, phone, email) => {
    let hash = hre.ethers.hashMessage(signer.address + fullname + phone + email);

    return hash;
}

const SignData = async (digicode, signer) => {
    let signedData = await signer.signMessage(digicode);

    return signedData;
}

const web3Connection = async () => {
    return new Web3('http://127.0.0.1:8545/');
}