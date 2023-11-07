// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IRoles {
    function setRole(string memory _role, address _user) external;
    function getRole(address _user) external view returns(string memory);
    function isIssuer(address _user) external view returns(bool);
    function isInvestor(address _user) external view returns(bool);
}