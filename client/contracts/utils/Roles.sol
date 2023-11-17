// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../Topos/interfaces/IRoles.sol";

contract Roles is IRoles {
    mapping(address => string) roles;

    address public owner;
    address public toposBankContract;
    address public issuerContract;
    address public investorContract;

    modifier onlyOwner {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }

    modifier onlyContracts {
        require(
            msg.sender == toposBankContract ||
            msg.sender == issuerContract ||
            msg.sender == investorContract,
            "Gov: WRONG_CONTRACT"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        roles[msg.sender] = "MANAGER";
    }

    function setToposContracts(
        address _toposBankContract,
        address _issuerContract,
        address _investorContract
    ) external onlyOwner {
        toposBankContract = _toposBankContract;
        issuerContract = _issuerContract;
        investorContract = _investorContract;
    }

    function setRole(
        string memory _role,
        address _user
    ) external onlyContracts {
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