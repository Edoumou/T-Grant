// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "../ERC20.sol";

contract EURT is ERC20 {
    constructor() ERC20('EUROT Token', 'EURT') {}
}