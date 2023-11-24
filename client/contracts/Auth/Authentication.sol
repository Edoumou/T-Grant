// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Authentication {
    struct User {
        string signatureHash;
        address userAddress;
    }

    mapping(address => User) user;

    uint256 public nbOfUsers;
    address public identityRegistryContract;

    constructor(address _identityRegistryContract) {
        identityRegistryContract = _identityRegistryContract;
    }

    function register(string memory _signature, address _user) external {
        require(
            msg.sender == identityRegistryContract,
            "ONLY_ID_REGISTRY_CONTRACT"
        );
        require(
            user[_user].userAddress ==
                address(0),
            "ALREADY_REGISTERED"
        );

        user[_user].signatureHash = _signature;
        user[_user].userAddress = _user;
        nbOfUsers++;
    }

    function getSignatureHash() external view returns (string memory) {
        require(msg.sender == user[msg.sender].userAddress, "Not allowed");

        return user[msg.sender].signatureHash;
    }

    function getUserAddress() external view returns (address) {
        return user[msg.sender].userAddress;
    }
}