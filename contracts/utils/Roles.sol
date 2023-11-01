// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../Topos/interfaces/IRoles.sol";

contract Roles is IRoles {
    mapping(address => string) public roles;

    address public toposBankContract;

    modifier onlyToposBank {
        require(
            msg.sender == toposBankContract,
            "Roles: ONLY_TOPOS_BANK"
        );
        _;
    }

    constructor(address _toposBankContract) {
        toposBankContract = _toposBankContract;
    }

    function setRole(string memory _role, address _user) external onlyToposBank {
        roles[_user] = _role;
    }

    function getRole(address _user) external view returns(string memory) {
        return roles[_user];
    }
}