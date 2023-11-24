// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./BondData.sol";
import "./Registry/IIdentityRegistry.sol";
import "./Topos/interfaces/IToposBank.sol";

contract BondStorage {
    mapping(string => BondData.IssueData) public issueData;
    mapping(string => BondData.Bond) public bonds;
    mapping(address => uint256) principals;
    mapping(address => bool) public isInvestor;
    mapping(address => mapping(address => uint256)) approvals;

    string public dealID;
    address public bondManager;
    address public toposBankContract;

    BondData.BondStatus public bondStatus;

    BondData.DealInvestment[] listOfInvestors;

    modifier onlyBondManager {
        require(msg.sender == bondManager, "ONLY_BOND_MANAGER");
        _;
    }

    modifier onlyToposBankContract {
        require(
            msg.sender == toposBankContract,
            "ONLY_TOPOS_BANK_CONTRACT"
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
}