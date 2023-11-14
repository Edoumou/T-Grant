// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../Topos/interfaces/IRoles.sol";

contract Roles is IRoles {
    mapping(address => string) roles;

    address public owner;
    address public toposBankContract;

    modifier onlyOwner {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }

    modifier onlyToposBank {
        require(
            msg.sender == toposBankContract,
            "Roles: ONLY_TOPOS_BANK"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        roles[msg.sender] = "MANAGER";
    }

    function setToposBankContract(
        address _toposBankContract
    ) external onlyOwner {
        toposBankContract = _toposBankContract;
    }

    function setRole(
        string memory _role,
        address _user
    ) external onlyToposBank {
        roles[_user] = _role;
    }

    function getRole(
        address _user
    ) external view returns(string memory) {
        return roles[_user];
    }

    function isIssuer(
        address _user
    ) external view returns(bool) {
        return keccak256(abi.encodePacked(roles[_user])) == keccak256(abi.encodePacked("ISSUER"));
    }

    function isInvestor(
        address _user
    ) external view returns(bool) {
        return keccak256(abi.encodePacked(roles[_user])) == keccak256(abi.encodePacked("INVESTOR"));
    }
}