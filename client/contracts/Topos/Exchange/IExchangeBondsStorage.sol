// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../BondData.sol";

interface IExchangeBondsStorage {
    function depositBonds(
        address _seller,
        string memory _dealID,
        uint256 _amount,
        uint256 _price
    ) external;

    function cancelBonds(
        string memory _dealID,
        address _seller
    ) external;

    function updatePrice(
        string memory _dealID,
        address _seller,
        uint256 _newPrice
    ) external;

    function buy(
        string memory _dealID,
        address _seller,
        address _buyer,
        uint256 _amount
    ) external;

    function increaseAmount(
        string memory _dealID,
        address _seller,
        uint256 _amountToAdd
    ) external;
}