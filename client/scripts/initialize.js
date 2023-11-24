const Addresses = require("../src/addresses/addr.json");
const hre = require("hardhat");

async function main() {
    let [deployer, ...users] = await hre.ethers.getSigners();

    let registry = await hre.ethers.getContractAt("IdentityRegistry", Addresses.RegistryContract);
    let roles = await hre.ethers.getContractAt("Roles", Addresses.RolesContract);
    let tokenCall = await hre.ethers.getContractAt("TokenCall", Addresses.TokenCallContract);
    let bank = await hre.ethers.getContractAt("ToposBank", Addresses.ToposBankContract);

    let tx = await bank.setIssuerFundContract(
        Addresses.IssuersFundContract,
        { from: deployer }
    );
    await tx.wait();

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

    let tx3 = await tokenCall.addTokenAddress(Addresses.USDCContract, { from: deployer });
    await tx3.wait();
    
    let tx4 = await tokenCall.addTokenAddress(Addresses.USDTContract, { from: deployer });
    await tx4.wait();
    
    let tx5 = await tokenCall.addTokenAddress(Addresses.EURCContract, { from: deployer });
    await tx5.wait();
    
    let tx6 = await tokenCall.addTokenAddress(Addresses.EURTContract, { from: deployer });
    await tx6.wait();
    
    let tx7 = await tokenCall.addTokenAddress(Addresses.CNYCContract, { from: deployer });
    await tx7.wait();
    
    let tx8 = await tokenCall.addTokenAddress(Addresses.CNYTContract, { from: deployer });
    await tx8.wait();
    
    let tx9 = await tokenCall.addTokenAddress(Addresses.DAIContract, { from: deployer });
    await tx9.wait();

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