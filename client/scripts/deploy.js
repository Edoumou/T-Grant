const fs = require('fs');
const { exec } = require('child_process');
const hre = require("hardhat");

async function main() {
  let [deployer, ...users] = await hre.ethers.getSigners();

  //=== IdentityRegistry Contract
  const IdentityRegistry = await hre.ethers.getContractFactory("IdentityRegistry");
  const registery = await IdentityRegistry.deploy();
  await registery.waitForDeployment();
  console.log("Registry:", registery.target || "");

  //=== Authentication Contract
  const Authentication = await hre.ethers.getContractFactory("Authentication");
  const authentication = await Authentication.deploy(registery.target);
  await authentication.waitForDeployment();
  console.log("Auth----:", authentication.target || "");
  
  //=== Roles Contract
  const Roles = await hre.ethers.getContractFactory("Roles");
  const roles = await Roles.deploy();
  await roles.waitForDeployment();
  console.log("T--Roles:", roles.target || "");

  //=== BondCall Contract
  const BondCall = await hre.ethers.getContractFactory("BondCall");
  const bondCall = await BondCall.deploy();
  await bondCall.waitForDeployment();
  console.log("BondCall:", bondCall.target || "");

  //=== IRSCall Contract
  const IRSCall = await hre.ethers.getContractFactory("IRSCall");
  const irsCall = await IRSCall.deploy();
  await irsCall.waitForDeployment();
  console.log("IRSCall:", irsCall.target || "");

  //=== ToposBank Contract
  const ToposBank = await hre.ethers.getContractFactory("ToposBank");
  const bank = await ToposBank.deploy(
    deployer.address,
    roles.target,
    registery.target,
    bondCall.target,
    irsCall.target,
    350
  );
  await bank.waitForDeployment();
  console.log("T---Bank:", bank.target || "");

  //=== Issuer Contract
  const IssuerContract = await hre.ethers.getContractFactory("Issuer");
  const issuerContract = await IssuerContract.deploy(bank.target);
  await issuerContract.waitForDeployment();
  console.log("T-Issuer:", issuerContract.target || "");

  //=== Investor Contract
  const InvestorContract = await hre.ethers.getContractFactory("Investor");
  const investorContract = await InvestorContract.deploy(bank.target);
  await investorContract.waitForDeployment();
  console.log("Investor:", investorContract.target || "");

  //=== ToposTreasury Contract
  const ToposTreasury = await hre.ethers.getContractFactory("ToposTreasury");
  const toposTreasury = await ToposTreasury.deploy(bank.target);
  await toposTreasury.waitForDeployment();
  console.log("Treasury:", toposTreasury.target || "");

  //=== IssuersFund Contract
  const IssuersFund = await hre.ethers.getContractFactory("IssuersFund");
  const issuersFund = await IssuersFund.deploy(bank.target, toposTreasury.target);
  await issuersFund.waitForDeployment();
  console.log("Issuer-F:", issuersFund.target || "");

  //=== BondFactory Contract
  const BondFactory = await hre.ethers.getContractFactory("BondFactory");
  const bondFactory = await BondFactory.deploy(bank.target);
  await bondFactory.waitForDeployment();
  console.log("Factory-:", bondFactory.target || "");

  //=== USDC Contract
  const USDC = await hre.ethers.getContractFactory("USDC");
  const usdc = await USDC.deploy();
  await usdc.waitForDeployment();
  console.log("USDC Tok:", usdc.target || "");

  //=== USDT Contract
  const USDT = await hre.ethers.getContractFactory("USDT");
  const usdt = await USDT.deploy();
  await usdt.waitForDeployment();
  console.log("USDT Tok:", usdt.target || "");

  //=== EURC Contract
  const EURC = await hre.ethers.getContractFactory("EURC");
  const eurc = await EURC.deploy();
  await eurc.waitForDeployment();
  console.log("EURC Tok:", eurc.target || "");

  //=== EURT Contract
  const EURT = await hre.ethers.getContractFactory("EURT");
  const eurt = await EURT.deploy();
  await eurt.waitForDeployment();
  console.log("EURT Tok:", eurt.target || "");

  //=== CNYC Contract
  const CNYC = await hre.ethers.getContractFactory("CNYC");
  const cnyc = await CNYC.deploy();
  await cnyc.waitForDeployment();
  console.log("CNYC Tok:", cnyc.target || "");

  //=== CNYT Contract
  const CNYT = await hre.ethers.getContractFactory("CNYT");
  const cnyt = await CNYT.deploy();
  await cnyt.waitForDeployment();
  console.log("CNYT Tok:", cnyt.target || "");

  //=== DAI Contract
  const DAI = await hre.ethers.getContractFactory("DAI");
  const dai = await DAI.deploy();
  await dai.waitForDeployment();
  console.log("DAI- Tok:", dai.target || "");

    //=== TokenCall Contract
    const TokenCall = await hre.ethers.getContractFactory("TokenCall");
    const tokenCall = await TokenCall.deploy();
    await tokenCall.waitForDeployment();
    console.log("Token-Ca:", tokenCall.target || "");

  //== CouponMath Library
  const CouponMath = await hre.ethers.getContractFactory("CouponMath");
  const couponMath = await CouponMath.deploy();
  await couponMath.waitForDeployment();
  console.log("Coupon-M:", couponMath.target || "");

  //=== CouponPayment Contract
  const CouponPayment = await hre.ethers.getContractFactory("CouponPayment", {
    libraries: {
      CouponMath: couponMath.target
    }
  });
  const couponPayment = await CouponPayment.deploy();
  await couponPayment.waitForDeployment();
  console.log("Coupon-P:", couponPayment.target || "");

  //=== Exchange contract
  const Exchange = await hre.ethers.getContractFactory("Exchange");
  const exchange = await Exchange.deploy(bank.target, bondCall.target);
  await exchange.waitForDeployment();
  console.log("Exchange:", exchange.target || "");

  //=== ExchangeBondsStorage contract
  const ExchangeBondsStorage = await hre.ethers.getContractFactory("ExchangeBondsStorage");
  const exchangeBondsStorage = await ExchangeBondsStorage.deploy(
    bank.target,
    exchange.target,
    bondCall.target
  );
  await exchangeBondsStorage.waitForDeployment();
  console.log("Ex Bonds:", exchangeBondsStorage.target || "");


  console.log("");
  //=== Cp artifacts in `src/contracts` directory
  exec(`cp -R ../client/artifacts ../client/src/contracts`, (err, stdout, stderr) => {
    if(err) {
      console.log(`exec error: ${err}`);
      return;
    }
  });

  const data = {
    "AuthenticationContract": authentication.target,
    "RegistryContract": registery.target,
    "RolesContract": roles.target,
    "ToposBankContract": bank.target,
    "IssuerContract": issuerContract.target,
    "InvestorContract": investorContract.target,
    "ToposTreasuryContract": toposTreasury.target,
    "IssuersFundContract": issuersFund.target,
    "BondCallContract": bondCall.target,
    "IRSCallContract": irsCall.target,
    "BondFactoryContract": bondFactory.target,
    "USDCContract": usdc.target,
    "USDTContract": usdt.target,
    "EURCContract": eurc.target,
    "EURTContract": eurt.target,
    "CNYCContract": cnyc.target,
    "CNYTContract": cnyt.target,
    "DAIContract": dai.target,
    "CouponPaymentContract": couponPayment.target,
    "TokenCallContract": tokenCall.target,
    "ExchangeContract": exchange.target,
    "ExchangeBondsStorageContract": exchangeBondsStorage.target
  };

  //=== Write contracts addresses in `addr.json`file
  const PATH = './src/addresses/addr.json';
  const stringified = JSON.stringify(data)

  fs.writeFileSync(PATH, stringified, err => {
    if(err) throw err;
  });
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
});
