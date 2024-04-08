// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../interfaces/IERC7586.sol";

contract ERC7586 is IERC7586 {
    function fixedInterestPayer() external view returns(address) {
        
    }

    function floatingInterestPayer() external view returns(address) {

    }

    function ratesDecimals() external view returns(uint8) {

    }

    function swapRate() external view returns(uint256) {

    }

    function spread() external view returns(uint256) {

    }

    function assetContract() external view returns(address) {

    }

    function notionalAmount() external view returns(uint256) {

    }

    function paymentFrequency() external view returns(uint256) {

    }

    function paymentDates() external view returns(uint256[] memory) {

    }

    function startingDate() external view returns(uint256) {

    }

    function maturityDate() external view returns(uint256) {

    }

    function benchmark() external view returns(uint256) {

    }

    function oracleContractForBenchmark() external view returns(address) {

    }

    function swap() external returns(bool) {

    }

    function terminateSwap() external {

    }
}