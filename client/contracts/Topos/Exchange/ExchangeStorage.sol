// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../BondData.sol";
import "../../BondCall.sol";

contract ExchangeStorage {
    mapping(address => mapping(string => BondData.Listing)) public investorListing;

    address public bankContract;
    address public bondCallContract;

    BondData.Listing[] dealListed;
}