// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../BondData.sol";
import "..//interfaces/IRoles.sol";
import "../interfaces/IToposBank.sol";
import "../../Registry/IIdentityRegistry.sol";

contract Issuer {
    mapping(address => BondData.Issuer) public issuers;

    address public toposBankContract;

    BondData.Issuer[] listOfIssuers;

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
        address issuerAddress = _issuer.walletAddress;

        require(msg.sender == issuerAddress, "INVALID_ADDRESS");
        require(
            issuers[issuerAddress].status == BondData.StakeHolderStatus.UNDEFINED,
            "CHECK_YOUR_STATUS"
        );

        issuers[issuerAddress] = _issuer;
        issuers[issuerAddress].status = BondData.StakeHolderStatus.SUBMITTED;
        issuers[issuerAddress].index = listOfIssuers.length;

        listOfIssuers.push(_issuer);

        emit RequestIssuerRegistration(issuerAddress);
    }

    /**
    * @notice Approves an issuer registration request. Can be called only by Topos manager
    * @param _issuerAddress issuer's account address
    */
    function approveIssuer(address _issuerAddress) external {
        BondData.Issuer memory _issuer = issuers[_issuerAddress];

        (address toposManager, address rolesContract, , ,) = IToposBank(toposBankContract).getContracts();

        require(msg.sender == toposManager, "ONLY_TOPOS_MANAGER");
        require(
            _issuer.status == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        issuers[_issuerAddress].status = BondData.StakeHolderStatus.APPROVED;
        listOfIssuers[_issuer.index].status = BondData.StakeHolderStatus.APPROVED;
        IRoles(rolesContract).setRole("ISSUER", _issuerAddress);

        emit ApproveIssuer(_issuerAddress);
    }

    /**
    * @notice Rejects an issuer registration request. Can be called only by Topos manager
    * @param _issuerAddress issuer's account address
    */
    function rejectIssuer(address _issuerAddress) external {
        BondData.Issuer memory _issuer = issuers[_issuerAddress];

        (address toposManager, , , ,) = IToposBank(toposBankContract).getContracts();

        require(msg.sender == toposManager, "ONLY_TOPOS_MANAGER");
        require(
            _issuer.status == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        issuers[_issuerAddress].status = BondData.StakeHolderStatus.REJECTED;
        listOfIssuers[_issuer.index].status = BondData.StakeHolderStatus.REJECTED;

        emit RejectIssuer(_issuerAddress);
    }

    function getIssuers() external view returns(BondData.Issuer[] memory) {
        return listOfIssuers;
    }
}