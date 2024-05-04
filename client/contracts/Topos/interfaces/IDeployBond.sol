// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "../IRS/IRSTypes.sol";

interface IDeployBond {
    function setBondContractAddress(
        string memory _dealID,
        address _ercAddress
    ) external;
    function setIRSContractAddress(
        address _fixedPayerContract,
        address _floatingPayerContract,
        address _irsContractAddress,
        IRSTypes.IRS memory _irs
    ) external ;
}