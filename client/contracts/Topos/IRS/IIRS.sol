// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

interface IIRS {
    function swap() external;
    function terminateSwap() external;
    function setBenchmark(uint256 _newBenchmark) external;
}