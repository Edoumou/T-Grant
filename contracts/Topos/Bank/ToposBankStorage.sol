// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../BondData.sol";

contract ToposBankStorage {
    mapping(string => BondData.Deal) public deals;
    mapping(string => BondData.DealStatus) public dealStatus;
    mapping(address => BondData.Issuer) public issuers;
    mapping(address => BondData.Investor) public investors;
    mapping(string => address) public dealBondContracts;
    mapping(address => string) public roles;
    mapping(address => BondData.StakeHolderStatus) public issuerStatus;
    mapping(address => BondData.StakeHolderStatus) public investorStatus;

    address public toposManager;
    address public rolesContract;

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
}