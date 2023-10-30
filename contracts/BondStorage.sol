// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./BondData.sol";

contract BondStorage {
    mapping(string => BondData.Bond) bonds;
    mapping(address => uint256) principals;
    mapping(address => mapping(address => uint256)) approvals;

    string public dealID;
    address public bondManager;
    address public bondCallContract;

    BondData.BondStatus public bondStatus;
}