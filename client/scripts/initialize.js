const Addresses = require("../src/addresses/addr.json");
const hre = require("hardhat");

async function main() {
    let [deployer, ...users] = await hre.ethers.getSigners();

    let registry = await hre.ethers.getContractAt("IdentityRegistry", Addresses.RegistryContract);
    let roles = await hre.ethers.getContractAt("Roles", Addresses.RolesContract);

    let tx1 = await registry.setAuthenticationContract(
        Addresses.AuthenticationContract,
        { from: deployer }
    );

    await tx1.wait();

    let tx2 = await roles.setToposContracts(
        Addresses.ToposBankContract,
        Addresses.IssuerContract,
        Addresses.InvestorContract,
        { from: deployer }
    );

    await tx2.wait();

    let myIssuer = await roles.issuerContract({ from: deployer });
    let myInvestor = await roles.investorContract({ from: deployer });
    console.log('issuer contract:', myIssuer);
    console.log('investor contract:', myInvestor);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
});