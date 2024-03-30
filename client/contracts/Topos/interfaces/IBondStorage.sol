// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../BondData.sol";

interface IBondStorage {
    function dealID() external view returns(string memory);
    function countryOfIssuance() external view returns(string memory);
    function bondManager() external view returns(address);
    function bankContract() external view returns(address);
    function bondCallContract() external view returns(address);
    function bondStatus() external view returns(BondData.BondStatus);
    function getListOfInvestors() external view returns(BondData.DealInvestment[] memory);
    function bondInfo() external view returns(BondData.Bond memory);
    function issuerInfo() external view returns(address);
    function isInvestors(address _account) external view returns(bool);
}