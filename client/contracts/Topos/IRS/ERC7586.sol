// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../interfaces/IERC7586.sol";
import "../../tests/tokens/IERC20.sol";
import "../../tests/tokens/ERC20.sol";
import "./IRSStorage.sol";
import "./IRSTypes.sol";

contract ERC7586 is IERC7586, IRSStorage, ERC20 {
    constructor(
        address _fixedPayerContract,
        address _floatingPayerContract,
        string memory _irsTokenName,
        string memory _irsTokenSymbol,
        IRSTypes.IRS memory _irs
    ) ERC20(_irsTokenName, _irsTokenSymbol) {
        fixedPayerContract = _fixedPayerContract;
        floatingPayerContract = _floatingPayerContract;
        irs = _irs;
    }

    function fixedInterestPayer() external view returns(address) {
        return irs.fixedInterestPayer;
    }

    function floatingInterestPayer() external view returns(address) {
        return irs.floatingInterestPayer;
    }

    function ratesDecimals() external view returns(uint8) {
        return irs.ratesDecimals;
    }

    function swapRate() external view returns(uint256) {
        return irs.swapRate;
    }

    function spread() external view returns(uint256) {
        return irs.spread;
    }

    function assetContract() external view returns(address) {
        return irs.assetContract;
    }

    function notionalAmount() external view returns(uint256) {
        return irs.notionalAmount;
    }

    function paymentFrequency() external view returns(uint256) {
        return irs.paymentFrequency;
    }

    function startingDate() external view returns(uint256) {
        return irs.startingDate;
    }

    function maturityDate() external view returns(uint256) {
        return irs.maturityDate;
    }

    function benchmark() external view returns(uint256) {
        return irs.benchmark;
    }

    function swap() external returns(bool) {

    }

    function terminateSwap() external {

    }
}