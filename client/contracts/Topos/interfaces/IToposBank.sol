// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./IBonds.sol";
import "../../BondData.sol";

interface IToposBank {
    function getDeal(
        string memory _dealID
    ) external view returns(BondData.Deal memory);

    function getDealBondContract(
        string memory _dealID
    ) external view returns(address);

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
        address bondCall,
        address issuerFund
    );

    function getBenchmark() external view returns(uint256);
}