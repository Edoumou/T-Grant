// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./IRSTypes.sol";

abstract contract IRSStorage {
    IRSTypes.IRS irs;
    address public fixedPayerContract;
    address public floatingPayerContract;
    address public owner;
    address public toposBankContract;
    uint8 public isActive;
    uint8 public numberOfSwaps;
    uint8 public swapCount;

    event SetBenchmark(uint256 oldBenchmark, uint256 newBenchmark);

    modifier onlyOwner {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier toBeActive {
        require(isActive == 1, "Not Active");
        _;
    }

    modifier onlyToposBank {
        require(msg.sender == toposBankContract, "Only Bank Contract");
        _;
    }
}