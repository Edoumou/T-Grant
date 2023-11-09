// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../BondData.sol";
import "..//interfaces/IRoles.sol";
import "../interfaces/IToposBank.sol";
import "../../Registry/IIdentityRegistry.sol";

contract Issuer {
    mapping(address => BondData.Issuer) public issuers;
    mapping(address => BondData.StakeHolderStatus) public issuerStatus;

    address public toposBankContract;

    event ApproveIssuer(address issuer);
    event RejectIssuer(address issuer);
    event RequestIssuerRegistration(address issuer);

    modifier onlyToposBankContract {
        require(
            msg.sender == toposBankContract,
            "ONLY_TOPOS_BANK"
        );
        _;
    }

    modifier mustBeApproved(address _user) {
        (, , address registry, ,) = IToposBank(toposBankContract).getContracts();

        require(
            IIdentityRegistry(registry).isVerified(_user),
            "ACCOUNT_NOT_AAPROVED"
        );
        _;
    }

    constructor(address _toposBankContract) {
        toposBankContract =_toposBankContract;
    }

    /**
    * @notice Sends an registration request to become an issuer.
    * @param _issuer Issuer struct. See BondData.sol
    */
    function requestRegistrationIssuer(
        BondData.Issuer calldata _issuer
    ) external mustBeApproved(_issuer.walletAddress) {
        require(msg.sender == _issuer.walletAddress, "INVALID_ADDRESS");
        require(
            issuerStatus[msg.sender] == BondData.StakeHolderStatus.UNDEFINED,
            "CHECK_YOUR_STATUS"
        );

        issuers[_issuer.walletAddress] = _issuer;
        issuerStatus[msg.sender] = BondData.StakeHolderStatus.SUBMITTED;

        emit RequestIssuerRegistration(_issuer.walletAddress);
    }

    /**
    * @notice Approves an issuer registration request. Can be called only by Topos manager
    * @param _issuer issuer's account address
    */
    function approveIssuer(address _issuer) external {
        (address toposManager, address rolesContract, , ,) = IToposBank(toposBankContract).getContracts();

        require(msg.sender == toposManager, "ONLY_TOPOS_MANAGER");
        require(
            issuerStatus[_issuer] == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        issuerStatus[_issuer] = BondData.StakeHolderStatus.APPROVED;
        IRoles(rolesContract).setRole("ISSUER", _issuer);

        emit ApproveIssuer(_issuer);
    }

    /**
    * @notice Rejects an issuer registration request. Can be called only by Topos manager
    * @param _issuer issuer's account address
    */
    function rejectIssuer(address _issuer) external {
        (address toposManager, , , ,) = IToposBank(toposBankContract).getContracts();

        require(msg.sender == toposManager, "ONLY_TOPOS_MANAGER");
        require(
            issuerStatus[_issuer] == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        issuerStatus[_issuer] = BondData.StakeHolderStatus.REJECTED;

        emit RejectIssuer(_issuer);
    }
}