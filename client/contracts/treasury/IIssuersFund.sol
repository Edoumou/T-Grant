// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IIssuersFund {
    function addFund(string memory _dealID, uint256 _amount) external;
    function withdrawFund(string memory _dealID, address _issuer, address _tokenAddress) external;
}