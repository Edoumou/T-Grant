// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../BondCall.sol";
import "../../BondData.sol";

contract Exchange {
    address public bondCallContract;

    constructor(address _bondCallContract) {
        bondCallContract = _bondCallContract;
    }

    function listBonds(BondData.Listing calldata _listing) external {
    }
}