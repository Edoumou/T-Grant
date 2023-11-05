// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../BondData.sol";
import "../../Registry/IIdentityRegistry.sol";
import "../../tests/tokens/IERC20.sol";

contract ToposBankStorage {
    mapping(string => BondData.Deal) public deals;
    mapping(address => BondData.Issuer) public issuers;
    mapping(address => BondData.Investor) public investors;
    mapping(string => address) public dealBondContracts;
    mapping(string => BondData.DealInvestment[]) public dealInvestment;
    mapping(string => uint256) public totalAmountInvestedForDeal;
    mapping(address => BondData.StakeHolderStatus) public issuerStatus;
    mapping(address => BondData.StakeHolderStatus) public investorStatus;
    mapping(address => mapping(string => BondData.Investment)) public amountInvested;

    address public toposManager;
    address public rolesContract;
    address public identityRegistryContract;

    BondData.Bond[] bonds;
    BondData.Deal[] listOfDeals;

    address bondFactoryContract;

    modifier onlyToposManager {
        require(
            msg.sender == toposManager,
            "ONLY_TOPOS_MANAGER"
        );
        _;
    }

    modifier mustBeApproved(address _user) {
        require(
            IIdentityRegistry(identityRegistryContract).isVerified(_user),
            "ACCOUNT_NOT_AAPROVED"
        );
        _;
    }

    event RequestIssuerRegistration(address issuer);
    event RequestInvestorRegistration(address investor);
    event ApproveIssuer(address issuer);
    event ApproveInvestor(address investor);
    event RejectIssuer(address issuer);
    event RejectInvestor(address investor);
    event DealSubmitted(string dealID, BondData.Deal deal);
    event DealAPproved(string dealID);
    event DealARejected(string dealID);
    event RegisterForDeal(string dealID, address investor);
    event BondIssue(string _dealID);
    event BondRedeem(string _dealID);
}