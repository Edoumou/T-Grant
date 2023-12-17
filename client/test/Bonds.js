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

    let StakeHolderStatus = {
        UNDEFINED: '0',
        SUBMITTED: '1',
        APPROVED: '2',
        REJECTED: '3'
    }

    let maturityDate = Date.now() + 120;

    beforeEach(async () => {
        [deployer, amazon, ggvcapital, user0, ...users] = await hre.ethers.getSigners();

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
        await exchange.setExchangeBondsStorage(exchangeStorage.target);

        await tokenCall.addTokenAddress(usdc.target);
        await tokenCall.addTokenAddress(usdt.target);
        await tokenCall.addTokenAddress(eurc.target);
        await tokenCall.addTokenAddress(eurt.target);
        await tokenCall.addTokenAddress(cnyc.target);
        await tokenCall.addTokenAddress(cnyt.target);
        await tokenCall.addTokenAddress(dai.target);

        // Register the Bond Manager
        let authHash = await AuthenticationHash('123456', deployer);
        let identyHash = await RegistrationHash(deployer, 'Manager', '0102030405', 'manager@topos.com');

        await registry.connect(deployer).register(identyHash, authHash);
        
        // Register an account that will be used as issuer
        authHash = await AuthenticationHash('123456', amazon);
        identyHash = await RegistrationHash(amazon, 'Amazon', '0102030405', 'info@amazon.com');

        await registry.connect(amazon).register(identyHash, authHash);
        
        // Register an account that will be used as investor
        authHash = await AuthenticationHash('123456', ggvcapital);
        identyHash = await RegistrationHash(ggvcapital, 'GGV Capital', '0102030405', 'info@ggvc.com');

        await registry.connect(ggvcapital).register(identyHash, authHash);

        // Issuer-Investor submit a request to become issuer-investor
        let issuerData = {
            documentURI: "https://www.amazon.com/doc/doc.pdf",
            name: "Amzon",
            country: "US",
            issuerType: "CORP",
            creditRating: "AA-",
            carbonCredit: "1200",
            walletAddress: amazon.address,
            status: StakeHolderStatus.UNDEFINED,
            index: "0",
            logoURI: "https://www.amazon.com/doc/logo.png"
        };

        let investorData = {
            name: "GGV Capital",
            country: "US",
            investorType: "VC",
            walletAddress: ggvcapital.address,
            status: StakeHolderStatus.UNDEFINED,
            index: "0"
        }

        await issuer.connect(amazon).requestRegistrationIssuer(issuerData);
        await investor.connect(ggvcapital).requestRegistrationInvestor(investorData);

        // Manager approves the above issuer and investor
        await issuer.connect(deployer).approveIssuer(amazon.address);
        await investor.connect(deployer).approveInvestor(ggvcapital.address);

        // Issuer Submits a Deal
        let deals = await bank.connect(amazon).getListOfDeals();

        let deal = {
            dealID: "DEAL-001",
            prospectusURI: "https://www.amazon.com/doc/deal.pdf",
            issuerAddress: amazon.address,
            debtAmount: "1000000",
            denomination: "100",
            couponRate: "250",
            couponFrequency: "2",
            maturityDate: maturityDate,
            index: Number(deals.length) + '',
            currency: usdc.target,
            couponType: "1",
            status: "0"
        }

        await bank.connect(amazon).submitDeal("DEAL-001", deal);

        // manager approves the deal
        await bank.connect(deployer).approveDeal("DEAL-001");
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

    it("Checks the Exchange Bonds storage contract address in the Exchange contract", async () => {
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
    
    it("Checks the bond manager is registered", async () => {
        let isRegistered = await registry.isVerified(deployer.address);

        expect(isRegistered).to.be.true;
    });

    it("Checks Amazon is registered as an issuer", async () => {
        let amazonData = await issuer.connect(amazon).issuers(amazon.address);

        expect(amazonData.documentURI).to.equal("https://www.amazon.com/doc/doc.pdf");
        expect(amazonData.name).to.equal("Amzon");
        expect(amazonData.country).to.equal("US");
        expect(amazonData.issuerType).to.equal("CORP");
        expect(amazonData.creditRating).to.equal("AA-");
        expect(amazonData.carbonCredit).to.equal("1200");
        expect(amazonData.walletAddress).to.equal(amazon.address);
        expect(amazonData.status).to.equal(StakeHolderStatus.APPROVED);
        expect(amazonData.index).to.equal("0");
        expect(amazonData.logoURI).to.equal("https://www.amazon.com/doc/logo.png");
    });

    it("Checks GGV Capital is registered as an investor", async () => {
        let ggvcapitalData = await investor.connect(ggvcapital).investors(ggvcapital.address);

        expect(ggvcapitalData.name).to.equal("GGV Capital");
        expect(ggvcapitalData.country).to.equal("US");
        expect(ggvcapitalData.investorType).to.equal("VC");
        expect(ggvcapitalData.walletAddress).to.equal(ggvcapital.address);
        expect(ggvcapitalData.status).to.equal(StakeHolderStatus.APPROVED);
        expect(ggvcapitalData.index).to.equal("0");
    });

    it("Checks the Amazon deal has been approved", async () => {
        let deal = await bank.connect(deployer).deals("DEAL-001");

        expect(deal.dealID).to.equal("DEAL-001");
        expect(deal.prospectusURI).to.equal("https://www.amazon.com/doc/deal.pdf");
        expect(deal.issuerAddress).to.equal(amazon.address);
        expect(deal.debtAmount).to.equal("1000000");
        expect(deal.denomination).to.equal("100");
        expect(deal.couponRate).to.equal("250");
        expect(deal.couponFrequency).to.equal("2");
        expect(deal.maturityDate).to.equal(maturityDate);
        expect(deal.index).to.equal("0");
        expect(deal.currency).to.equal(usdc.target);
        expect(deal.couponType).to.equal("1");
        expect(deal.status).to.equal("2");
    });

    it("Investors can register to a deal", async () => {
        // Mint payment tokens
        await tokenCall.connect(ggvcapital).mint(
            ggvcapital.address,
            "1000000000000000000000000",
            usdc.target
        );

        await usdc.connect(ggvcapital).approve(bank.target, "1000000000000000000000000");
        await bank.connect(ggvcapital).registerForDeal("DEAL-001", "1000000");

        let invested = await bank.connect(ggvcapital).amountInvested(ggvcapital.address, "DEAL-001");
        
        expect(invested.hasInvested).to.be.true;
        expect(invested.amount).to.equal("1000000");
    });

    it("Not registered users cannot invest in deal", async () => {
        await tokenCall.connect(user0).mint(
            ggvcapital.address,
            "1000000000000000000000000",
            usdc.target
        );

        await usdc.connect(user0).approve(bank.target, "1000000000000000000000000");

        expect(
            bank.connect(user0).registerForDeal("DEAL-001", "1000000")
        ).to.rejectedWith(Error, "ACCOUNT_NOT_AAPROVED");
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