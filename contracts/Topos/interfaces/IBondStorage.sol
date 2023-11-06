// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../BondData.sol";

interface IBondStorage {
    function getListOfInvestors() external view returns(BondData.DealInvestment[] memory);
}