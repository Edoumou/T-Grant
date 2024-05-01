// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../BondData.sol";
import "../IRS/IRSTypes.sol";
import "../../Registry/IIdentityRegistry.sol";

contract ToposBankStorage {
    mapping(string => BondData.Deal) public deals;
    mapping(string => address) public dealBondContracts;
    mapping(address => mapping(address => address)) irsContracts;
    mapping(string => BondData.DealInvestment[]) public dealInvestment;
    mapping(string => uint256) public totalAmountInvestedForDeal;
    mapping(address investorAccount => mapping(string => BondData.Investment)) public amountInvested;
    mapping(address issuerAccount => BondData.Deal[]) public issuerDeals;
    mapping(address issuerAccount => IRSTypes.IRS[]) public issuerIRS;

    address public toposManager;
    address public rolesContract;
    address public identityRegistryContract;
    address public bondCallContract;
    address public irsCallContract;
    address public issuersFundContract;

    uint256 public dealFees;
    uint256 internal benchmark;

    BondData.Bond[] bonds;
    BondData.Deal[] listOfDeals;
    string[] bondsDealIDs;
    IRSTypes.IRS[] irs;

    address bondFactoryContract;

    event DealSubmitted(string dealID, BondData.Deal deal);
    event DealAPproved(string dealID);
    event DealARejected(string dealID);
    event RegisterForDeal(string dealID, address investor);
    event BondIssue(string _dealID);
    event BondRedeem(string _dealID);

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
}