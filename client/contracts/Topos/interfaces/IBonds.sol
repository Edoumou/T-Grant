// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../BondData.sol";

interface IBonds {
    function issue(BondData.Bond calldata _bond) external;
    function redeem() external;
    function swap() external;
    function terminateSwap() external;
    function getListOfInvestors() external view returns(BondData.DealInvestment[] memory);
}