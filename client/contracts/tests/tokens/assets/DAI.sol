// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "../ERC20.sol";

contract DAI is ERC20 {
    constructor() ERC20('DAI Token', 'DAI') {}
}