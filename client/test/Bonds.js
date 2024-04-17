const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const hre = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const Web3 = require('web3');

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Tokenized Bonds", async () => {
    let registry;
    let authentication;
    let roles;
    let bondCall;
    let irsCall;
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

    let StakeHolderStatus = {
        UNDEFINED: '0',
        SUBMITTED: '1',
        APPROVED: '2',
        REJECTED: '3'
    }

    DealStatus = {
        UNDEFINED: '0',
        SUBMITTED: '1',
        APPROVED: '2',
        REJECTED: '3',
        ISSUED: '4',
        REDEEMED: '5'
    }

    let maturityDate = Date.now() + 120;

    let zeroAddress = '0x0000000000000000000000000000000000000000';

    beforeEach(async () => {
        [deployer, amazon, tesla, ggvcapital, accel, user0, ...users] = await hre.ethers.getSigners();

        registry = await hre.ethers.deployContract("IdentityRegistry");
        authentication = await hre.ethers.deployContract("Authentication", [registry.target]);
        roles = await hre.ethers.deployContract("Roles");
        bondCall = await hre.ethers.deployContract("BondCall");
        irsCall = await hre.ethers.deployContract("IRSCall");
        bank = await hre.ethers.deployContract("ToposBank",
            [
                deployer.address,
                roles.target,
                registry.target,
                bondCall.target,
                irsCall.target,
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

        await bank.setBenchmark('200');

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
        
        // Register two accounts that will be used as issuer
        authHash = await AuthenticationHash('123456', amazon);
        identyHash = await RegistrationHash(amazon, 'Amazon', '0102030405', 'info@amazon.com');

        await registry.connect(amazon).register(identyHash, authHash);

        authHash = await AuthenticationHash('123456', tesla);
        identyHash = await RegistrationHash(tesla, 'Tesla', '0102030405', 'info@tesla.com');

        await registry.connect(tesla).register(identyHash, authHash);
        
        // Register accounts that will be used as investor
        let authHashGGVC = await AuthenticationHash('123456', ggvcapital);
        let identyHashGGVC = await RegistrationHash(ggvcapital, 'GGV Capital', '0102030405', 'info@ggvc.com');

        let authHashACCEL = await AuthenticationHash('123456', accel);
        let identyHashACCEL = await RegistrationHash(accel, 'Accel', '0102030405', 'info@accel.com');

        await registry.connect(ggvcapital).register(identyHashGGVC, authHashGGVC);
        await registry.connect(accel).register(identyHashACCEL, authHashACCEL);

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

        let issuerData2 = {
            documentURI: "https://www.tesla.com/doc/doc.pdf",
            name: "Tesla",
            country: "US",
            issuerType: "CORP",
            creditRating: "AA-",
            carbonCredit: "3500",
            walletAddress: tesla.address,
            status: StakeHolderStatus.UNDEFINED,
            index: "0",
            logoURI: "https://www.tesla.com/doc/logo.png"
        };

        let investorData = {
            name: "GGV Capital",
            country: "US",
            investorType: "VC",
            walletAddress: ggvcapital.address,
            status: StakeHolderStatus.UNDEFINED,
            index: "0"
        }

        let investorData2 = {
            name: "Accel",
            country: "US",
            investorType: "Angel Investor",
            walletAddress: accel.address,
            status: StakeHolderStatus.UNDEFINED,
            index: "0"
        }

        await issuer.connect(amazon).requestRegistrationIssuer(issuerData);
        await issuer.connect(tesla).requestRegistrationIssuer(issuerData2);
        await investor.connect(ggvcapital).requestRegistrationInvestor(investorData);
        await investor.connect(accel).requestRegistrationInvestor(investorData2);

        // Manager approves the above issuer and investors
        await issuer.connect(deployer).approveIssuer(amazon.address);
        await issuer.connect(deployer).approveIssuer(tesla.address);
        await investor.connect(deployer).approveInvestor(ggvcapital.address);
        await investor.connect(deployer).approveInvestor(accel.address);

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

        deals = await bank.connect(tesla).getListOfDeals();

        let deal2 = {
            dealID: "DEAL-002",
            prospectusURI: "https://www.tesla.com/doc/deal.pdf",
            issuerAddress: tesla.address,
            debtAmount: "3000000",
            denomination: "100",
            couponRate: "150",
            couponFrequency: "4",
            maturityDate: maturityDate,
            index: Number(deals.length) + '',
            currency: usdc.target,
            couponType: "2",
            status: "0"
        }

        await bank.connect(tesla).submitDeal("DEAL-002", deal2);

        // manager approves the deal
        await bank.connect(deployer).approveDeal("DEAL-002");
    });

    it("Checks deployment", async () => {
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

    it("Deploys a bond contract", async () => {
        await tokenCall.connect(ggvcapital).mint(
            ggvcapital.address,
            "1000000000000000000000000",
            usdc.target
        );

        await usdc.connect(ggvcapital).approve(bank.target, "1000000000000000000000000");
        await bank.connect(ggvcapital).registerForDeal("DEAL-001", "1000000");

        let isBondBefore = await factory.connect(deployer).isBondContract("DEAL-001");
        let bondContractBefore = await bank.connect(deployer).dealBondContracts("DEAL-001");

        await factory.connect(deployer).DeployBondContract(
            "DEAL-001",
            amazon.address,
            bank.target,
            "US"
        );

        let isBondAfter = await factory.connect(deployer).isBondContract("DEAL-001");
        let bondContractAfter = await bank.connect(deployer).dealBondContracts("DEAL-001");

        expect(isBondBefore).to.be.false;
        expect(isBondAfter).to.be.true;
        expect(bondContractBefore).to.equal(zeroAddress);
        expect(bondContractAfter).not.to.equal(zeroAddress);
    });

    it("Issues Bonds to investors", async () => {
        await tokenCall.connect(ggvcapital).mint(
            ggvcapital.address,
            "1000000000000000000000000",
            usdc.target
        );

        await usdc.connect(ggvcapital).approve(bank.target, "1000000000000000000000000");
        await bank.connect(ggvcapital).registerForDeal("DEAL-001", "1000000");

        await factory.connect(deployer).DeployBondContract(
            "DEAL-001",
            amazon.address,
            bank.target,
            "US"
        );

        let bondContract = await bank.connect(deployer).dealBondContracts("DEAL-001");

        let issueDate = Date.now();
        let _maturityDate = issueDate + 120;

        let principalBefore = await bondCall.principalOf(ggvcapital.address, bondContract);

        let bond = {
            isin: "US90QE431HJK",
            name: "Amazon 2025",
            symbol: "AMZ25",
            currency: usdc.target,
            denomination: "100",
            issueVolume: "1000000",
            couponRate: "250",
            couponType: "1",
            couponFrequency: "2",
            issueDate: Math.floor(issueDate) + '',
            maturityDate: _maturityDate
        }

        await bank.connect(deployer).issue(
            "DEAL-001",
            bond,
            bondContract
        );

        let isin = await bondCall.isin(bondContract);
        let name = await bondCall.name(bondContract);
        let symbol = await bondCall.symbol(bondContract);
        let currency = await bondCall.currency(bondContract);
        let denomination = await bondCall.denomination(bondContract);
        let issueVolume = await bondCall.issueVolume(bondContract);
        let couponRate = await bondCall.couponRate(bondContract);
        let couponType = await bondCall.couponType(bondContract);
        let couponFrequency = await bondCall.couponFrequency(bondContract);

        let principalAfter = await bondCall.principalOf(ggvcapital.address, bondContract);
        let balance = await principalAfter / denomination;

        expect(isin).to.equal("US90QE431HJK");
        expect(name).to.equal("Amazon 2025");
        expect(symbol).to.equal("AMZ25");
        expect(currency).to.equal(usdc.target);
        expect(denomination).to.equal("100");
        expect(issueVolume).to.equal("1000000");
        expect(couponRate).to.equal("250");
        expect(couponType).to.equal("1");
        expect(couponFrequency).to.equal("2");

        expect(principalBefore).to.equal("0");

        expect(principalAfter).to.equal("1000000");
        expect(balance).to.equal("10000");
    });

    it("Transfers Bonds", async () => {
        await tokenCall.connect(ggvcapital).mint(
            ggvcapital.address,
            "1000000000000000000000000",
            usdc.target
        );

        let principal = "1000000";

        await usdc.connect(ggvcapital).approve(bank.target, "1000000000000000000000000");
        await bank.connect(ggvcapital).registerForDeal("DEAL-001", principal);

        await factory.connect(deployer).DeployBondContract(
            "DEAL-001",
            amazon.address,
            bank.target,
            "US"
        );

        let bondContract = await bank.connect(deployer).dealBondContracts("DEAL-001");

        let issueDate = Date.now();
        let _maturityDate = issueDate + 120;

        let bond = {
            isin: "US90QE431HJK",
            name: "Amazon 2025",
            symbol: "AMZ25",
            currency: usdc.target,
            denomination: "100",
            issueVolume: "1000000",
            couponRate: "250",
            couponType: "1",
            couponFrequency: "2",
            issueDate: Math.floor(issueDate) + '',
            maturityDate: _maturityDate
        }

        await bank.connect(deployer).issue(
            "DEAL-001",
            bond,
            bondContract
        );

        let denomination = await bondCall.denomination(bondContract);

        let ggvcPrincipalBefore = await bondCall.principalOf(ggvcapital.address, bondContract);
        let accelPrincipalBefore = await bondCall.principalOf(accel.address, bondContract);

        let amountToTransfer = "3000";
        let principalToTransfer = Number(amountToTransfer) * Number(denomination);

        await bondCall.connect(ggvcapital).approve(
            bondCall.target,
            amountToTransfer,
            bondContract
        );

        await bondCall.connect(ggvcapital).transferFrom(
            ggvcapital.address,
            accel.address,
            amountToTransfer,
            "0x",
            bondContract
        );

        let ggvcPrincipalAfter = await bondCall.principalOf(ggvcapital.address, bondContract);
        let accelPrincipalAfter = await bondCall.principalOf(accel.address, bondContract);

        expect(ggvcPrincipalBefore).to.equal(principal);
        expect(accelPrincipalBefore).to.equal("0");
        expect(ggvcPrincipalAfter).to.equal(Number(ggvcPrincipalBefore) - principalToTransfer);
        expect(accelPrincipalAfter).to.equal(principalToTransfer);
    });

    it("Lists bonds on Exchange", async () => {
        await tokenCall.connect(ggvcapital).mint(
            ggvcapital.address,
            "1000000000000000000000000",
            usdc.target
        );

        let principal = "1000000";

        await usdc.connect(ggvcapital).approve(bank.target, "1000000000000000000000000");
        await bank.connect(ggvcapital).registerForDeal("DEAL-001", principal);

        await factory.connect(deployer).DeployBondContract(
            "DEAL-001",
            amazon.address,
            bank.target,
            "US"
        );

        let bondContract = await bank.connect(deployer).dealBondContracts("DEAL-001");

        let issueDate = Date.now();
        let _maturityDate = issueDate + 120;

        let bond = {
            isin: "US90QE431HJK",
            name: "Amazon 2025",
            symbol: "AMZ25",
            currency: usdc.target,
            denomination: "100",
            issueVolume: "1000000",
            couponRate: "250",
            couponType: "1",
            couponFrequency: "2",
            issueDate: Math.floor(issueDate) + '',
            maturityDate: _maturityDate
        }

        await bank.connect(deployer).issue(
            "DEAL-001",
            bond,
            bondContract
        );

        let denomination = await bondCall.denomination(bondContract);

        let ggvcPrincipalBefore = await bondCall.principalOf(ggvcapital.address, bondContract);
        let exchangePrincipalBefore = await bondCall.principalOf(exchangeStorage.target, bondContract);

        let amountTolist = "3000";
        let price = "95";
        let principalToList = Number(amountTolist) * Number(denomination);

        await bondCall.connect(ggvcapital).approve(
            exchange.target,
            amountTolist,
            bondContract
        );

        await exchange.connect(ggvcapital).listBonds(
            "DEAL-001",
            amountTolist,
            price
        );

        let listing = await exchangeStorage.investorListing(
            ggvcapital.address,
            "DEAL-001"
        );

        let ggvcPrincipalAfter = await bondCall.principalOf(ggvcapital.address, bondContract);
        let exchangePrincipalAfter = await bondCall.principalOf(exchangeStorage.target, bondContract);

        expect(listing.amount).to.equal(amountTolist);
        expect(listing.price).to.equal(price);
        expect(ggvcPrincipalBefore).to.equal(principal);
        expect(exchangePrincipalBefore).to.equal("0");
        expect(ggvcPrincipalAfter).to.equal(Number(ggvcPrincipalBefore) - principalToList);
        expect(exchangePrincipalAfter).to.equal(principalToList);
    });

    it("Unlists bonds from the exchange", async () => {
        await tokenCall.connect(ggvcapital).mint(
            ggvcapital.address,
            "1000000000000000000000000",
            usdc.target
        );

        let principal = "1000000";

        await usdc.connect(ggvcapital).approve(bank.target, "1000000000000000000000000");
        await bank.connect(ggvcapital).registerForDeal("DEAL-001", principal);

        await factory.connect(deployer).DeployBondContract(
            "DEAL-001",
            amazon.address,
            bank.target,
            "US"
        );

        let bondContract = await bank.connect(deployer).dealBondContracts("DEAL-001");

        let issueDate = Date.now();
        let _maturityDate = issueDate + 120;

        let bond = {
            isin: "US90QE431HJK",
            name: "Amazon 2025",
            symbol: "AMZ25",
            currency: usdc.target,
            denomination: "100",
            issueVolume: "1000000",
            couponRate: "250",
            couponType: "1",
            couponFrequency: "2",
            issueDate: Math.floor(issueDate) + '',
            maturityDate: _maturityDate
        }

        await bank.connect(deployer).issue(
            "DEAL-001",
            bond,
            bondContract
        );

        let denomination = await bondCall.denomination(bondContract);

        let amountTolist = "3000";
        let price = "95";
        let principalToList = Number(amountTolist) * Number(denomination);

        await bondCall.connect(ggvcapital).approve(
            exchange.target,
            amountTolist,
            bondContract
        );

        await exchange.connect(ggvcapital).listBonds(
            "DEAL-001",
            amountTolist,
            price
        );

        let listingBeforeCancel = await exchangeStorage.investorListing(
            ggvcapital.address,
            "DEAL-001"
        );

        let ggvcPrincipalBefore = await bondCall.principalOf(ggvcapital.address, bondContract);
        let exchangePrincipalBefore = await bondCall.principalOf(exchangeStorage.target, bondContract);

        await exchange.connect(ggvcapital).unlistBonds("DEAL-001");

        let ggvcPrincipalAfter = await bondCall.principalOf(ggvcapital.address, bondContract);
        let exchangePrincipalAfter = await bondCall.principalOf(exchangeStorage.target, bondContract);

        let listingAfterCancel = await exchangeStorage.investorListing(
            ggvcapital.address,
            "DEAL-001"
        );

        expect(listingBeforeCancel.amount).to.equal(amountTolist);
        expect(listingBeforeCancel.price).to.equal(price);
        expect(listingAfterCancel.amount).to.equal("0");
        expect(listingAfterCancel.price).to.equal("0");
        expect(ggvcPrincipalBefore).to.equal(Number(principal) - principalToList);
        expect(exchangePrincipalBefore).to.equal(principalToList);
        expect(ggvcPrincipalAfter).to.equal(Number(ggvcPrincipalBefore) + principalToList);
        expect(exchangePrincipalAfter).to.equal(Number(exchangePrincipalBefore) - principalToList);
    });

    it("Updates bonds price on exchange", async () => {
        await tokenCall.connect(ggvcapital).mint(
            ggvcapital.address,
            "1000000000000000000000000",
            usdc.target
        );

        let principal = "1000000";

        await usdc.connect(ggvcapital).approve(bank.target, "1000000000000000000000000");
        await bank.connect(ggvcapital).registerForDeal("DEAL-001", principal);

        await factory.connect(deployer).DeployBondContract(
            "DEAL-001",
            amazon.address,
            bank.target,
            "US"
        );

        let bondContract = await bank.connect(deployer).dealBondContracts("DEAL-001");

        let issueDate = Date.now();
        let _maturityDate = issueDate + 120;

        let bond = {
            isin: "US90QE431HJK",
            name: "Amazon 2025",
            symbol: "AMZ25",
            currency: usdc.target,
            denomination: "100",
            issueVolume: "1000000",
            couponRate: "250",
            couponType: "1",
            couponFrequency: "2",
            issueDate: Math.floor(issueDate) + '',
            maturityDate: _maturityDate
        }

        await bank.connect(deployer).issue(
            "DEAL-001",
            bond,
            bondContract
        );

        let amountTolist = "3000";
        let price = "95";
        let newPrice = "105";

        await bondCall.connect(ggvcapital).approve(
            exchange.target,
            amountTolist,
            bondContract
        );

        await exchange.connect(ggvcapital).listBonds(
            "DEAL-001",
            amountTolist,
            price
        );

        let listingBeforeUpdate = await exchangeStorage.investorListing(
            ggvcapital.address,
            "DEAL-001"
        );

        await exchange.connect(ggvcapital).updateDealPrice(
            "DEAL-001",
            newPrice
        );

        let listingAfterUpdate = await exchangeStorage.investorListing(
            ggvcapital.address,
            "DEAL-001"
        );

        expect(listingBeforeUpdate.price).to.equal(price);
        expect(listingAfterUpdate.price).to.equal(newPrice);
    });

    it("Increases the amount of bonds listed on exchange", async () => {
        await tokenCall.connect(ggvcapital).mint(
            ggvcapital.address,
            "1000000000000000000000000",
            usdc.target
        );

        let principal = "1000000";

        await usdc.connect(ggvcapital).approve(bank.target, "1000000000000000000000000");
        await bank.connect(ggvcapital).registerForDeal("DEAL-001", principal);

        await factory.connect(deployer).DeployBondContract(
            "DEAL-001",
            amazon.address,
            bank.target,
            "US"
        );

        let bondContract = await bank.connect(deployer).dealBondContracts("DEAL-001");

        let issueDate = Date.now();
        let _maturityDate = issueDate + 120;

        let bond = {
            isin: "US90QE431HJK",
            name: "Amazon 2025",
            symbol: "AMZ25",
            currency: usdc.target,
            denomination: "100",
            issueVolume: "1000000",
            couponRate: "250",
            couponType: "1",
            couponFrequency: "2",
            issueDate: Math.floor(issueDate) + '',
            maturityDate: _maturityDate
        }

        await bank.connect(deployer).issue(
            "DEAL-001",
            bond,
            bondContract
        );

        let amountTolist = "3000";
        let price = "95";
        let amountToAdd = "2000";

        await bondCall.connect(ggvcapital).approve(
            exchange.target,
            amountTolist,
            bondContract
        );

        await exchange.connect(ggvcapital).listBonds(
            "DEAL-001",
            amountTolist,
            price
        );

        let listingBeforeUpdate = await exchangeStorage.investorListing(
            ggvcapital.address,
            "DEAL-001"
        );

        await bondCall.connect(ggvcapital).approve(
            exchange.target,
            amountToAdd,
            bondContract
        );

        await exchange.connect(ggvcapital).increaseListingAmount(
            "DEAL-001",
            amountToAdd
        );

        let listingAfterUpdate = await exchangeStorage.investorListing(
            ggvcapital.address,
            "DEAL-001"
        );

        expect(listingBeforeUpdate.amount).to.equal(amountTolist);
        expect(listingAfterUpdate.amount).to.equal(Number(amountTolist) + Number(amountToAdd));
    });

    it("Redeems bonds", async () => {
        await tokenCall.connect(ggvcapital).mint(
            ggvcapital.address,
            "1000000000000000000000000",
            usdc.target
        );

        await tokenCall.connect(ggvcapital).mint(
            bank.target,
            "1000000000000000000000000",
            usdc.target
        );

        let principal = "1000000";

        await usdc.connect(ggvcapital).approve(bank.target, "1000000000000000000000000");
        await bank.connect(ggvcapital).registerForDeal("DEAL-001", principal);

        await factory.connect(deployer).DeployBondContract(
            "DEAL-001",
            amazon.address,
            bank.target,
            "US"
        );

        let bondContract = await bank.connect(deployer).dealBondContracts("DEAL-001");

        let issueDate = Date.now();
        let _maturityDate = issueDate + 120;

        let bond = {
            isin: "US90QE431HJK",
            name: "Amazon 2025",
            symbol: "AMZ25",
            currency: usdc.target,
            denomination: "100",
            issueVolume: "1000000",
            couponRate: "250",
            couponType: "1",
            couponFrequency: "2",
            issueDate: Math.floor(issueDate) + '',
            maturityDate: _maturityDate
        }

        await bank.connect(deployer).issue(
            "DEAL-001",
            bond,
            bondContract
        );

        let deal = await bank.deals("DEAL-001");
        let statusBefore = deal.status;

        await time.increaseTo(issueDate + 150);
        await bank.connect(deployer).redeem("DEAL-001", bondContract);

        deal = await bank.deals("DEAL-001");
        let statusAfter = deal.status;

        expect(statusBefore).to.equal(DealStatus.ISSUED);
        expect(statusAfter).to.equal(DealStatus.REDEEMED);
    });

    it.only("Issues a fixed rate and a floating rate bond contracts", async () => {
        await tokenCall.connect(ggvcapital).mint(
            ggvcapital.address,
            "5000000000000000000000000",
            usdc.target
        );

        await usdc.connect(ggvcapital).approve(bank.target, "5000000000000000000000000");
        await bank.connect(ggvcapital).registerForDeal("DEAL-001", "1000000");
        await bank.connect(ggvcapital).registerForDeal("DEAL-002", "3000000");

        await factory.connect(deployer).DeployBondContract(
            "DEAL-001",
            amazon.address,
            bank.target,
            "US"
        );

        await factory.connect(deployer).DeployBondContract(
            "DEAL-002",
            tesla.address,
            bank.target,
            "US"
        );

        let bondContract1 = await bank.connect(deployer).dealBondContracts("DEAL-001");
        let bondContract2 = await bank.connect(deployer).dealBondContracts("DEAL-002");

        let issueDate = Date.now();
        let _maturityDate1 = issueDate + 120;
        let _maturityDate2 = issueDate + 350;

        let _coupon1 = '250';
        let _coupon2 = '100';
        let benchmark = await bank.getBenchmark();
        let couponTot2 = Number(_coupon2) + Number(benchmark);

        let bond1 = {
            isin: "US90QE431HJK",
            name: "Amazon 2025",
            symbol: "AMZ25",
            currency: usdc.target,
            denomination: "100",
            issueVolume: "1000000",
            couponRate: _coupon1,
            couponType: "1",
            couponFrequency: "2",
            issueDate: Math.floor(issueDate) + '',
            maturityDate: _maturityDate1
        }

        let bond2 = {
            isin: "USNJPA298BGS",
            name: "Tesla 2030",
            symbol: "TSLA30",
            currency: usdc.target,
            denomination: "100",
            issueVolume: "3000000",
            couponRate: _coupon2,
            couponType: "2",
            couponFrequency: "2",
            issueDate: Math.floor(issueDate) + '',
            maturityDate: _maturityDate2
        }

        await bank.connect(deployer).issue(
            "DEAL-001",
            bond1,
            bondContract1
        );

        await bank.connect(deployer).issue(
            "DEAL-002",
            bond2,
            bondContract2
        );

        let couponRate1 = await bondCall.couponRate(bondContract1);
        let couponRate2 = await bondCall.couponRate(bondContract2);

        expect(couponRate1).to.equal(_coupon1);
        expect(couponRate2).to.equal(couponTot2);
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