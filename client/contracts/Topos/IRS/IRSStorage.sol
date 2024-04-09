// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./IRSTypes.sol";

contract IRSStorage {
    mapping(
        string dealIDFixedPayer => mapping(
            string dealIDFloatingPayer => IRSTypes.IRS
        )
    ) public irs;

    address fixedPayerContract;
    address floatingPayerContract;
}