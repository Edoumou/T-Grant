// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./IIdentityRegistry.sol";
import "./RegistryData.sol";

/**
* @title An Identity Registry for stakeholders
* @author @Edoumou
* @notice The purpose of this contract is to simulates an identity registry.
*/
contract IdentityRegistry is IIdentityRegistry {
    mapping(address => RegistryData.Stakeholder) private _stakeholders;
    mapping(address => RegistrationStatus) private _status;
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    enum RegistrationStatus {UKNOWN, VERIFIED}

    error AlreadyVerified();
    error InvalidAddress(address caller);

    /**
    * @notice Registers a stakeholder.
    * @notice Changes the status to VERIFIED
    * @param _stakeholder stakeholder struct. Check RegistryData.sol
    */
    function register(
        RegistryData.Stakeholder calldata _stakeholder
    ) external {
        if (msg.sender != _stakeholder.walletAddress) revert InvalidAddress(_stakeholder.walletAddress);
        if (_status[msg.sender] == RegistrationStatus.VERIFIED) revert AlreadyVerified();

        _status[_stakeholder.walletAddress] = RegistrationStatus.VERIFIED;
        _stakeholders[msg.sender] = _stakeholder;
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