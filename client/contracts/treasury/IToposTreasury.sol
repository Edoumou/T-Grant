// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IToposTreasury {
    function addFunds(string calldata _dealID, uint256 _amount) external;
}