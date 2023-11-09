const fs = require('fs');
const { exec } = require('child_process');
const hre = require("hardhat");

async function main() {
  let [deployer1, ...users] = await hre.ethers.getSigners();

  //=== IdentityRegistry Contract
  const IdentityRegistry = await hre.ethers.getContractFactory("IdentityRegistry");
  const register = await IdentityRegistry.deploy();
  await register.waitForDeployment();

  //=== Roles Contract
  const Roles = await hre.ethers.getContractFactory("Roles");
  const roles = await Roles.deploy();
  await roles.waitForDeployment();


  //=== ToposBank Contract
  const ToposBank = await hre.ethers.getContractFactory("ToposBank");
  const bank = await ToposBank.deploy(
    deployer1.address,
    roles.target,
    register.target,
    350
  );
  await bank.waitForDeployment();

  //=== Issuer Contract
  const IssuerContract = await hre.ethers.getContractFactory("Issuer");
  const issuerContract = await IssuerContract.deploy(bank.target);
  await issuerContract.waitForDeployment();

  //=== Investor Contract
  const InvestorContract = await hre.ethers.getContractFactory("Investor");
  const investorContract = await InvestorContract.deploy(bank.target);
  await investorContract.waitForDeployment();

  //=== ToposTreasury Contract
  const ToposTreasury = await hre.ethers.getContractFactory("ToposTreasury");
  const toposTreasury = await ToposTreasury.deploy(bank.target);
  await toposTreasury.waitForDeployment();

  //=== IssuersFund Contract
  const IssuersFund = await hre.ethers.getContractFactory("IssuersFund");
  const issuersFund = await IssuersFund.deploy(bank.target, toposTreasury.target);
  await issuersFund.waitForDeployment();

  //=== BondCall Contract
  const BondCall = await hre.ethers.getContractFactory("BondCall");
  const bondCall = await BondCall.deploy();
  await bondCall.waitForDeployment();

  //=== BondFactory Contract
  const BondFactory = await hre.ethers.getContractFactory("BondFactory");
  const bondFactory = await BondFactory.deploy(bank.target, bondCall.target);
  await bondFactory.waitForDeployment();

  //=== USDC Contract
  const USDC = await hre.ethers.getContractFactory("USDC");
  const usdc = await USDC.deploy();;
  await usdc.waitForDeployment()

  //=== USDT Contract
  const USDT = await hre.ethers.getContractFactory("USDT");
  const usdt = await USDT.deploy();
  await usdt.waitForDeployment();

  //=== EURC Contract
  const EURC = await hre.ethers.getContractFactory("EURC");
  const eurc = await EURC.deploy();
  await eurc.waitForDeployment();

  //=== EURT Contract
  const EURT = await hre.ethers.getContractFactory("EURT");
  const eurt = await EURT.deploy();
  await eurt.waitForDeployment();

  //=== CNYC Contract
  const CNYC = await hre.ethers.getContractFactory("CNYC");
  const cnyc = await CNYC.deploy();
  await cnyc.waitForDeployment();

  //=== CNYT Contract
  const CNYT = await hre.ethers.getContractFactory("CNYT");
  const cnyt = await CNYT.deploy();
  await cnyt.waitForDeployment();

  //=== DAI Contract
  const DAI = await hre.ethers.getContractFactory("DAI");
  const dai = await DAI.deploy();
  await dai.waitForDeployment();

  //== CouponMath Library
  const CouponMath = await hre.ethers.getContractFactory("CouponMath");
  const couponMath = await CouponMath.deploy();
  await couponMath.waitForDeployment();

  //=== CouponPayment Contract
  const CouponPayment = await hre.ethers.getContractFactory("CouponPayment", {
    libraries: {
      CouponMath: couponMath.target
    }
  });
  const couponPayment = await CouponPayment.deploy();
  await couponPayment.waitForDeployment();

  //=== Cp artifacts in `src/contracts` directory
  exec(`cp -R ../client/artifacts ../client/src/contracts`, (err, stdout, stderr) => {
    if(err) {
      console.log(`exec error: ${err}`);
      return;
    }
  })

  // CONSOLE.LOG
  console.log("Registry:", register.target || "");
  console.log("T--Roles:", roles.target || "");
  console.log("T---Bank:", bank.target || "");
  console.log("T-Issuer:", issuerContract.target || "");
  console.log("Investor:", investorContract.target || "");
  console.log("Treasury:", toposTreasury.target || "");
  console.log("Issuer-F:", issuersFund.target || "");
  console.log("BondCall:", bondCall.target || "");
  console.log("Factory-:", bondFactory.target || "");
  console.log("USDC Tok:", usdc.target || "");
  console.log("USDT Tok:", usdt.target || "");
  console.log("EURC Tok:", eurc.target || "");
  console.log("EURT Tok:", eurt.target || "");
  console.log("CNYC Tok:", cnyc.target || "");
  console.log("CNYT Tok:", cnyt.target || "");
  console.log("DAI- Tok:", dai.target || "");
  console.log("Coupon-P:", couponPayment.target || "");
  console.log("");

  const data = {
    "RegistryContract": register.target,
    "RolesContract": roles.target,
    "ToposBankContract": bank.target,
    "IssuerContract": issuerContract.target,
    "InvestorContract": investorContract.target,
    "ToposTreasuryContract": toposTreasury.target,
    "IssuersFundContract": issuersFund.target,
    "BondCallContract": bondCall.target,
    "BondFactoryContract": bondFactory.target,
    "USDCContract": usdc.target,
    "USDTContract": usdt.target,
    "EURCContract": eurc.target,
    "EURTContract": eurt.target,
    "CNYCContract": cnyc.target,
    "CNYTContract": cnyt.target,
    "DAIContract": dai.target,
    "CouponPaymentContract": couponPayment.target
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
