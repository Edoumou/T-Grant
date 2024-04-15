// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IDeployBond {
    function setBondContractAddress(
        string memory _dealID,
        address _ercAddress
    ) external;
    function setIRSContractAddress(
        address _fixedPayerContract,
        address _floatingPayerContract,
        address _irsContractAddress
    ) external ;
}