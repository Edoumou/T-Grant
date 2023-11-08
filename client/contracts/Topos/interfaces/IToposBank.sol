// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./IBonds.sol";

interface IToposBank {
    function getTotalAmounInvested(
        string calldata _dealID
    ) external view returns(uint256);

    function getDealInvestment(
        string calldata _dealID
    ) external view returns(BondData.DealInvestment[] memory);

    function getDealFees() external view returns(uint256);

    function getContracts() external view returns(
        address manager,
        address roles,
        address identityRegistry,
        address issuerFund
    );
}