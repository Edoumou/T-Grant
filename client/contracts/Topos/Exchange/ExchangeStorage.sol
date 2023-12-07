// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../BondData.sol";
import "../../BondCall.sol";
import "../interfaces/IToposBank.sol";
import "../../tests/tokens/IERC20.sol";
import "./IExchangeBondsStorage.sol";

contract ExchangeStorage {
    mapping(address => mapping(string => BondData.Listing)) public investorListing;

    address public bankContract;
    address public bondCallContract;
    address internal exchangeBondsStorage;

    BondData.Listing[] dealListed;

    event BondsListed(string dealID, address seller, uint256 amount, uint256 price);
    event BondsCanceled(string dealID, address seller);
    event PriceUpdated(string dealID, address seller, uint256 newPrice);
    event BondBought(string dealID, address seller, address buyer, uint256 amount);
    event AmountIncreased(string dealID, address seller, uint256 amountToAdd);
}