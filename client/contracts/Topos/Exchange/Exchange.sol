// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./ExchangeStorage.sol";

contract Exchange is ExchangeStorage {
    constructor(
        address _bankContract,
        address _bondCallContract
    ) {
        owner = msg.sender;
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

        uint256 allowance = BondCall(bondCallContract).allowance(
            msg.sender,
            address(this),
            bondContract
        );

        require(_amount <= allowance, "allowance");
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
    * @notice Unlists bonds from exchange
    * @param _dealID bond deal ID
    */
    function unlistBonds(string memory _dealID) external {
        IExchangeBondsStorage(exchangeBondsStorage).cancelBonds(
            _dealID,
            msg.sender
        );

        emit BondsCanceled(_dealID, msg.sender);
    }

    /**
    * @notice Updates the price of a listing
    * @param _dealID bond deal ID
    * @param _newPrice new price
    */
    function updateDealPrice(
        string memory _dealID,
        uint256 _newPrice
    ) external {
        require(_newPrice > 0, "invalid amount");

        IExchangeBondsStorage(exchangeBondsStorage).updatePrice(
            _dealID,
            msg.sender,
            _newPrice
        );

        emit PriceUpdated(_dealID, msg.sender, _newPrice);
    }

    /**
    * Increases the amount of bonds listed
    * @param _dealID bond deal ID
    * @param _amountToAdd amount of tokens to add to the listing
    */
    function increaseListingAmount(
        string memory _dealID,
        uint256 _amountToAdd
    ) external {
        address bondContract = IToposBank(bankContract).getDealBondContract(_dealID);

        require(_amountToAdd > 0, "invalid amount");

        IExchangeBondsStorage(exchangeBondsStorage).increaseAmount(
            _dealID,
            msg.sender,
            _amountToAdd
        );

        uint256 allowance = BondCall(bondCallContract).allowance(
            msg.sender,
            address(this),
            bondContract
        );

        require(_amountToAdd <= allowance, "allowance");

        BondCall(bondCallContract).transferFrom(
            msg.sender,
            exchangeBondsStorage,
            _amountToAdd,
            bytes('0x0'),
            bondContract
        );

        emit AmountIncreased(_dealID, msg.sender, _amountToAdd);
    }

    /**
    * @notice Buys bonds in secondary market
    * @param _dealID bond deal ID
    * @param _seller seller account address
    * @param _amount amount of bonds to buy
    */
    function buyBonds(
        string memory _dealID,
        address _seller,
        uint256 _amount
    ) external {
        address bondContract = IToposBank(bankContract).getDealBondContract(_dealID);
        address currency = BondCall(bondCallContract).currency(bondContract);
        uint256 price = investorListing[_seller][_dealID].price;
        uint256 payment = price * 1 ether;
        uint256 buyerBalance = IERC20(currency).balanceOf(msg.sender);

        require(buyerBalance >= payment, "balance");

        IExchangeBondsStorage(exchangeBondsStorage).buy(
            _dealID,
            _seller,
            msg.sender,
            _amount
        );

        IERC20(currency).transfer(_seller, payment);

        emit BondBought(_dealID, _seller, msg.sender, _amount);
    }

    /**
    * @notice Returns the array of all listings
    */
    function getDealsListed() external view returns(BondData.Listing[] memory) {
        return dealListed;
    }

    function setExchangeBondsStorage(
        address _exchangeBondsStorage
    ) external onlyOwner {
        require(_exchangeBondsStorage != address(0));

        exchangeBondsStorage = _exchangeBondsStorage;
    }
}