// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./ExchangeStorage.sol";

contract Exchange is ExchangeStorage {
    constructor(
        address _bankContract,
        address _bondCallContract
    ) {
        bankContract = _bankContract;
        bondCallContract = _bondCallContract;
    }

    /**
    * @notice Lists bonds on Exchange
    * @param _dealID bond deal ID
    * @param _amount amount of bonds to list
    * @param _price the price bonds should be sold at
    */
    function listBonds(
        string memory _dealID,
        uint256 _amount,
        uint256 _price
    ) external {
        address bondContract = IToposBank(bankContract).getDealBondContract(_dealID);

        require(_amount > 0, "invalid amount");

        IExchangeBondsStorage(exchangeBondsStorage).depositBonds(
            msg.sender,
            _dealID,
            _amount,
            _price
        );

        BondCall(bondCallContract).transferFrom(
            msg.sender,
            exchangeBondsStorage,
            _amount,
            bytes('0x0'),
            bondContract
        );

        emit BondsListed(_dealID, msg.sender, _amount, _price);
    }

    /**
    * @notice Cancels a listing
    * @param _dealID bond deal ID
    */
    function cancelListing(string memory _dealID) external {
        IExchangeBondsStorage(exchangeBondsStorage).cancelBonds(
            _dealID,
            msg.sender
        );

        emit BondsCanceled(_dealID, msg.sender);
    }

    /**
    * @notice Updates the price of a listing
    * @param _newPrice new price
    * @param _dealID bond deal ID
    */
    function updateDealPrice(uint256 _newPrice, string memory _dealID) external {
        address bondContract = IToposBank(bankContract).getDealBondContract(_dealID);
        uint256 amount = investorListing[msg.sender][_dealID].amount;
        uint256 previousPrice = investorListing[msg.sender][_dealID].price;
        uint256 maturityDate = BondCall(bondCallContract).maturityDate(bondContract);

        require(amount > 0, "bond not listed");
        require(_newPrice != previousPrice, "same price");
        require(block.timestamp < maturityDate, "Bonds matured");

        investorListing[msg.sender][_dealID].price = _newPrice;
        dealListed[investorListing[msg.sender][_dealID].index] = investorListing[msg.sender][_dealID];
    }

    /**
    * @notice Buys bonds in secondary market
    * @param _dealID bond deal ID
    * @param _seller seller account address
    * @param _amount amount of bonds to buy
    */
    function buy(string memory _dealID, address _seller, uint256 _amount) external {
        address bondContract = IToposBank(bankContract).getDealBondContract(_dealID);
        address currency = BondCall(bondCallContract).currency(bondContract);
        uint256 denomination = BondCall(bondCallContract).denomination(bondContract);
        uint256 price = investorListing[_seller][_dealID].price;
        uint256 payment = _amount * denomination * 1 ether;
        uint256 buyerBalance = IERC20(currency).balanceOf(msg.sender);
        uint256 listingAmount = investorListing[_seller][_dealID].amount;

        require(listingAmount > 0, "invalid listing");
        require(buyerBalance >= payment, "not enough payment tokens");
        require(buyerBalance >= price * 1 ether, "not enough payment tokens");
        require(_seller == investorListing[_seller][_dealID].owner, "invalid seller");
        require(_amount > 0 && _amount <= listingAmount, "invalid amount");

        investorListing[_seller][_dealID].amount = listingAmount - _amount;
        dealListed[investorListing[_seller][_dealID].index] = investorListing[_seller][_dealID];

        IERC20(currency).transfer(_seller, payment);
        BondCall(bondCallContract).transfer(msg.sender, _amount, bytes('0x0'), bondContract);
    }

    /**
    * @notice Returns the array of all listings
    */
    function getDealsListed() external view returns(BondData.Listing[] memory) {
        return dealListed;
    }

    function setExchangeBondsStorage(address _exchangeBondsStorage) external {
        require(_exchangeBondsStorage != address(0), "invalid address");

        exchangeBondsStorage = _exchangeBondsStorage;
    }
}