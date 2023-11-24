// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

interface IAuthentication {
    function register(string memory _signature, address _user) external;
}