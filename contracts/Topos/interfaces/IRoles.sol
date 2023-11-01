// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IRoles {
    function setRole(string memory _role, address _user) external;
}