const { expect } = require("chai");
const hre = require("hardhat");

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
    });

    it("Checks deployment", async () => {
        expect(registry.target).not.to.equal('');
        expect(authentication.target).not.to.equal('');
        expect(roles.target).not.to.equal('');
        expect(bondCall.target).not.to.equal('');
        expect(bank.target).not.to.equal('');
        expect(issuer.target).not.to.equal('');
        expect(investor.target).not.to.equal('');
        expect(treasury.target).not.to.equal('');
        expect(funds.target).not.to.equal('');
        expect(factory.target).not.to.equal('');
        expect(usdc.target).not.to.equal('');
        expect(usdt.target).not.to.equal('');
        expect(eurc.target).not.to.equal('');
        expect(eurt.target).not.to.equal('');
        expect(cnyc.target).not.to.equal('');
        expect(cnyt.target).not.to.equal('');
        expect(tokenCall.target).not.to.equal('');
        expect(couponMath.target).not.to.equal('');
        expect(couponPayment.target).not.to.equal('');
        expect(exchange.target).not.to.equal('');
        expect(exchangeStorage.target).not.to.equal('');
    });

    it("Set Funds contract addresse in Bank", async () => {
        await bank.setIssuerFundContract(funds.target);

        let fundsContract = await bank.issuersFundContract();

        expect(fundsContract).to.equal(funds.target);
    });
    
    it("Set Auth contract addresse in Identity Registry", async () => {
        await registry.setAuthenticationContract(authentication.target);

        let authContract = await registry.authenticationContract();

        expect(authContract).to.equal(authentication.target);
    });

    it("Allows the Exchange Bonds Storage to manage bonds", async () => {
        let isVerifiedBefore = await registry.isVerified(exchangeStorage.target);

        await registry.registerContract(exchangeStorage.target);

        let isVerifiedAfter = await registry.isVerified(exchangeStorage.target);

        expect(isVerifiedBefore).to.be.false;
        expect(isVerifiedAfter).to.be.true;
    });

    it("Sets contracts addresses in the Roles contract", async () => {
        await roles.setToposContracts(bank.target, issuer, investor);

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

    it("Adds payment tokens addresses in Token Call contract", async () => {
        await tokenCall.addTokenAddress(usdc.target);
        await tokenCall.addTokenAddress(usdt.target);
        await tokenCall.addTokenAddress(eurc.target);
        await tokenCall.addTokenAddress(eurt.target);
        await tokenCall.addTokenAddress(cnyc.target);
        await tokenCall.addTokenAddress(cnyt.target);
        await tokenCall.addTokenAddress(dai.target);

        let tokensAddress = await tokenCall.getTokenAddresses();

        expect(tokensAddress[0]).to.equal(usdc.target);
        expect(tokensAddress[1]).to.equal(usdt.target);
        expect(tokensAddress[2]).to.equal(eurc.target);
        expect(tokensAddress[3]).to.equal(eurt.target);
        expect(tokensAddress[4]).to.equal(cnyc.target);
        expect(tokensAddress[5]).to.equal(cnyt.target);
        expect(tokensAddress[6]).to.equal(dai.target);
    });
});