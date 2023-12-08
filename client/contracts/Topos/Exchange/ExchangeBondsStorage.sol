// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../IERC7092.sol";
import "../../BondData.sol";
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
            "invalid seller"
        );

        uint256 amount = investorListing[_seller][_dealID].amount;
        uint256 index = investorListing[_seller][_dealID].index;

        require(amount > 0, "invalid amount");

        investorListing[_seller][_dealID].amount = 0;
        investorListing[_seller][_dealID].price = 0;
        investorListing[_seller][_dealID].listingTime = 0;

        dealListed[index] = investorListing[_seller][_dealID];

        IERC7092(bondContract).transfer(
            _seller,
            amount,
            bytes('0x0')
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
        uint256 maturityDate = IERC7092(bondContract).maturityDate();

        require(seller == _seller, "invalid seller");
        require(amount > 0, "invalid amount");
        require(_newPrice != previousPrice, "unchanged price");
        require(block.timestamp < maturityDate, "bonds matured");

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

        require(seller == _seller, "invalid seller");
        require(previousAmount > 0, "invalid amount");

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

        require(seller == _seller, "invalid seller");
        require(amount > 0 && amount >= _amount, "invalid amount");

        // If all bonds are bought, set to zero listing params
        if (amount == _amount) {
            investorListing[_seller][_dealID].amount = 0;
            investorListing[_seller][_dealID].price = 0;
            investorListing[_seller][_dealID].listingTime = 0;
        } else {
            investorListing[_seller][_dealID].amount = amount - _amount;
        }

        dealListed[index] = investorListing[_seller][_dealID];

        IERC7092(bondContract).transfer(_buyer, _amount, bytes('0x0'));
    }

    /**
    * @notice Returns the array of all listings
    */
    function getDealsListed() external view returns(BondData.Listing[] memory) {
        return dealListed;
    }
}