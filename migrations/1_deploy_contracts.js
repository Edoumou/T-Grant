const IdentityRegistry = artifacts.require("IdentityRegistry");

module.exports = async function(deployer, network, accounts) {
    let account1 = accounts[0];

    await deployer.deploy(IdentityRegistry, account1);
}