// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./IRSTypes.sol";

abstract contract IRSStorage {
    IRSTypes.IRS irs;
    address fixedPayerContract;
    address floatingPayerContract;
    address owner;
    uint8 isActive;

    modifier onlyOwner {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier toBeActive {
        require(isActive == 1, "Not Active");
        _;
    }
}