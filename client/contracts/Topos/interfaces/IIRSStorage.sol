// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../IRS/IRSTypes.sol";

interface IIRSStorage {
    function decimals() external view returns (uint8);
    function increaseAllowance(address spender, uint256 addedValue) external;
    function decreaseAllowance(address spender, uint256 subtractedValue) external;
    function burn(address account, uint256 amount) external;
    function getFixedPayerContract() external view returns(address);
    function getFloatingPayerContract() external view returns(address);
    function getNumberOfSwaps() external view returns(uint8);
    function getSwapCount() external view returns(uint8);
    function isContractActive() external view returns(uint8);
    function irsInfo() external view returns(IRSTypes.IRS memory);
}