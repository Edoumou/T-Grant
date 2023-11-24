// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

abstract contract RegistryData {
    struct Stakeholder {
        string identityID;
        address walletAddress;
    }
}