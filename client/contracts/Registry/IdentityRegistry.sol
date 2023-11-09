// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./IIdentityRegistry.sol";
import "./RegistryData.sol";
import "../Auth/IAuthentication.sol";

/**
* @title An Identity Registry for stakeholders
* @author @Edoumou
* @notice The purpose of this contract is to simulates an identity registry.
*/
contract IdentityRegistry is IIdentityRegistry {
    mapping(address => RegistryData.Stakeholder) private _stakeholders;
    mapping(address => RegistrationStatus) private _status;
    mapping(string => bool) public kwcPassed;
    address public owner;
    address public authenticationContract;

    constructor() {
        owner = msg.sender;
    }

    function setAuthenticationContract(address _authenticationContract) external {
        require(msg.sender == owner, "ONLY_OWNER");

        authenticationContract = _authenticationContract;
    }

    enum RegistrationStatus {UNDEFINED, VERIFIED}

    error AlreadyVerified();
    error InvalidAddress(address caller);

    /**
    * @notice Registers a stakeholder.
    * @notice Changes the status to VERIFIED
    * @param _identityID Identity ID provided by the Identity Registry
    */
    function register(
        string memory _identityID,
        string memory _signature
    ) external {
        if (_status[msg.sender] == RegistrationStatus.VERIFIED) revert AlreadyVerified();
        require(!kwcPassed[_identityID], "ALREADY_PASSED_KWC");
        require(
            keccak256(abi.encodePacked(_identityID)) != keccak256(abi.encodePacked("")),
            "INVALID_IDENTITY_ID"
        );
        require(
            keccak256(abi.encodePacked(_signature)) != keccak256(abi.encodePacked("")),
            "INVALID_SIGNATURE"
        );

        kwcPassed[_identityID] = true;
        _status[msg.sender] = RegistrationStatus.VERIFIED;
        _stakeholders[msg.sender] = RegistryData.Stakeholder(
            {
                identityID: _identityID,
                walletAddress: msg.sender
            }
        );

        IAuthentication(authenticationContract).register(_signature, msg.sender);
    }

    /**
    * @notice Check if an account has been approved
    * @notice Returns true if approved, false otherwise
    * @param _stakeHolderAddress the stakeholder account address
    */
    function isVerified(
        address _stakeHolderAddress
    ) external view returns(bool) {
        return _status[_stakeHolderAddress] == RegistrationStatus.VERIFIED ? true : false;
    }

    /**
    * @notice Returns a stakeholder struct. Check RegistryData.sol
    * @param _stakeHolderAddress the stakeholder account address
    */
    function getStakeHolder(
        address _stakeHolderAddress
    ) external view returns(RegistryData.Stakeholder memory) {
        return _stakeholders[_stakeHolderAddress];
    }
}