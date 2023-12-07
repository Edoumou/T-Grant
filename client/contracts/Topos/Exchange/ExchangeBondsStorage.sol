// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../BondData.sol";
import "../../BondCall.sol";
import "../interfaces/IToposBank.sol";
import "./IExchangeBondsStorage.sol";

contract ExchangeBondsStorage is IExchangeBondsStorage {
    mapping(address => mapping(string => BondData.Listing)) public investorListing;

    address public bankContract;
    address public exchangeContract;
    address public bondCallContract;

    BondData.Listing[] dealListed;

    constructor(
        address _bankContract,
        address _exchangeContract,
        address _bondCallContract
    ) {
        bankContract = _bankContract;
        exchangeContract = _exchangeContract;
        bondCallContract = _bondCallContract;
    }

    modifier onlyExchangeContract {
        require(
            msg.sender == exchangeContract,
            "Only Exchange"
        );
        _;
    }

    function depositBonds(
        address _seller,
        string memory _dealID,
        uint256 _amount,
        uint256 _price
    ) external onlyExchangeContract {
        investorListing[_seller][_dealID] = BondData.Listing({
            dealID:  _dealID,
            owner: _seller,
            amount: _amount,
            price: _price,
            index: dealListed.length,
            listingTime: block.timestamp
        });

        dealListed.push(investorListing[_seller][_dealID]);
    }

    function cancelBonds(
        string memory _dealID,
        address _seller
    ) external onlyExchangeContract {
        address bondContract = IToposBank(bankContract).getDealBondContract(_dealID);

        require(
            _seller == investorListing[_seller][_dealID].owner,
            "invalid address"
        );

        uint256 amount = investorListing[_seller][_dealID].amount;
        uint256 index = investorListing[_seller][_dealID].index;

        require(amount > 0, "bonds not listed");

        investorListing[_seller][_dealID].amount = 0;
        investorListing[_seller][_dealID].price = 0;
        investorListing[_seller][_dealID].listingTime = 0;

        dealListed[index] = investorListing[_seller][_dealID];

        BondCall(bondCallContract).transfer(
            _seller,
            amount,
            bytes('0x0'),
            bondContract
        );
    }
}