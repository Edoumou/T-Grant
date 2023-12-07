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

    function updatePrice(
        string memory _dealID,
        address _seller,
        uint256 _newPrice
    ) external onlyExchangeContract {
        uint256 previousPrice = investorListing[_seller][_dealID].price;
        uint256 index = investorListing[_seller][_dealID].index;
        uint256 amount = investorListing[_seller][_dealID].amount;
        address seller = investorListing[_seller][_dealID].owner;

        address bondContract = IToposBank(bankContract).getDealBondContract(_dealID);
        uint256 maturityDate = BondCall(bondCallContract).maturityDate(bondContract);

        require(seller == _seller, "invalid address");
        require(amount > 0, "bonds not listed");
        require(_newPrice != previousPrice, "invalid price");
        require(block.timestamp < maturityDate, "Bonds matured");

        investorListing[_seller][_dealID].price = _newPrice;
        dealListed[index] = investorListing[_seller][_dealID];
    }

    function increaseAmount(
        string memory _dealID,
        address _seller,
        uint256 _amountToAdd
    ) external onlyExchangeContract {
        uint256 index = investorListing[_seller][_dealID].index;
        uint256 previousAmount = investorListing[_seller][_dealID].amount;
        address seller = investorListing[_seller][_dealID].owner;

        require(seller == _seller, "invalid address");
        require(previousAmount > 0, "bonds not listed");

        investorListing[_seller][_dealID].amount = previousAmount + _amountToAdd;
        dealListed[index] = investorListing[_seller][_dealID];
    }

    function buy(
        string memory _dealID,
        address _seller,
        address _buyer,
        uint256 _amount
    ) external onlyExchangeContract {
        address bondContract = IToposBank(bankContract).getDealBondContract(_dealID);

        uint256 index = investorListing[_seller][_dealID].index;
        uint256 amount = investorListing[_seller][_dealID].amount;
        address seller = investorListing[_seller][_dealID].owner;

        require(seller == _seller, "invalid address");
        require(amount > 0 && amount >= _amount, "bonds not listed");

        // If all bonds are bought, set to zero listing params
        if (amount == _amount) {
            investorListing[_seller][_dealID].amount = 0;
            investorListing[_seller][_dealID].price = 0;
            investorListing[_seller][_dealID].listingTime = 0;
        } else {
            investorListing[_seller][_dealID].amount = amount - _amount;
        }

        dealListed[index] = investorListing[_seller][_dealID];

        BondCall(bondCallContract).transfer(_buyer, _amount, bytes('0x0'), bondContract);
    }
}