// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const hre = require("hardhat");

async function main() {
  let [deployer1, deployer2] = await hre.ethers.getSigners();

  /**
  * Identity Registry
  */
  const IdentityRegistry = await hre.ethers.getContractFactory("IdentityRegistry");
  const register = await IdentityRegistry.deploy();

  /*
  * Roles
  */
  const Roles = await hre.ethers.getContractFactory("Roles");
  const roles = await Roles.deploy();

  /**
  * Topos Bank
  */
  const ToposBankStorage = await hre.ethers.getContractFactory("ToposBankStorage");
  const bankStorage = await ToposBankStorage.deploy();

  /*
  const ToposBank = await hre.ethers.getContractFactory("ToposBankStorage");
  const bank = await ToposBank.deploy(
    deployer1.address,
    roles.target,
    register.target,
    500 
  );
  */

  /**
  * Bond Topos
  */
  const BondTopos = await hre.ethers.getContractFactory("BondTopos");
  const bond = await BondTopos.deploy("DEAL-1", deployer2.address, "France");

  const id = await bond.dealID({ from: deployer1.address });


  // CONSOLE.LOG
  console.log("Registry:", register.target || "");
  console.log("T--Roles:", roles.target || "");
  console.log("T--Bonds:", bond.target || "");
  console.log("Bank Sto:", bankStorage.target || "");
  //console.log("T---Bank:", bank.target || "");
  console.log('deal--ID:', id || "");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
});
