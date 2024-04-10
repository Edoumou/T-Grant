// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../interfaces/IERC7586.sol";
import "../../tests/tokens/ERC20IRS.sol";
import "./IRSTypes.sol";

contract ERC7586 is IERC7586, ERC20IRS {
    constructor(
        address _fixedPayerContract,
        address _floatingPayerContract,
        string memory _irsTokenName,
        string memory _irsTokenSymbol,
        IRSTypes.IRS memory _irs
    ) ERC20IRS(_irsTokenName, _irsTokenSymbol) {
        fixedPayerContract = _fixedPayerContract;
        floatingPayerContract = _floatingPayerContract;
        irs = _irs;
        isActive = 1;
        owner = msg.sender;
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

    /**
    * @notice this function should be executed automaticaly with protocols like chainlink automation
    *          Since Chainlink doesn't integrate Topos yet, manual execution is considered (by owner)
    */
    function swap() external onlyOwner toBeActive returns(bool) {
        uint256 fixedRate = irs.swapRate;
        uint256 flotaingRate = irs.benchmark + irs.spread;
        uint256 notional = irs.notionalAmount;

        uint256 fixedInterest = notional * fixedRate;
        uint256 floatingInterest = notional * flotaingRate;

        uint256 interestToTransfer;
        address _recipient;
        address _payer;

        if(fixedInterest == floatingInterest) {
            revert("Noting to swap");
        } else if (fixedInterest > floatingInterest) {
            interestToTransfer = fixedInterest - floatingInterest;
            _recipient = irs.floatingInterestPayer;
            _payer = irs.fixedInterestPayer;
        } else {
            interestToTransfer =  floatingInterest - fixedInterest;
            _recipient = irs.fixedInterestPayer;
            _payer = irs.floatingInterestPayer;
        }

        burn(irs.fixedInterestPayer, 1 ether);
        burn(irs.floatingInterestPayer, 1 ether);

        IERC20(irs.assetContract).transferFrom(_payer, _recipient, interestToTransfer * 1 ether / 10_000);

        return true;
    }

    function terminateSwap() external toBeActive {
        isActive == 2;
    }
}