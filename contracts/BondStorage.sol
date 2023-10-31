// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./BondData.sol";
import "./Registry/IIdentityRegistry.sol";

contract BondStorage {
    mapping(string => BondData.IssueData) public issueData;
    mapping(string => BondData.Bond) public bonds;
    mapping(address => uint256) principals;
    mapping(address => mapping(address => uint256)) approvals;

    string public dealID;
    address public bondManager;

    BondData.BondStatus public bondStatus;

    modifier mustBeApproved(address _user) {
        address registry = issueData[dealID].identiRegistryContract;
        require(
            IIdentityRegistry(registry).isVerified(_user),
            "ACCOUNT_NOT_AAPROVED"
        );
        _;
    }
}