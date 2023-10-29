// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IIdentityRegistry.sol";
import "./RegistryData.sol";

/**
* @title An Identity Registry for stakeholders
* @author @Edoumou
* @notice The purpose of this contract is to simulates an identity registry.
*/
contract IdentityRegistrty is IIdentityRegistry, Ownable {
    mapping(address => RegistryData.Stakeholder) private _stakeholders;
    mapping(address => RegistrationStatus) private _status;

    enum RegistrationStatus {UKNOWN, REQUESTED, VERIFIED, REJECTED}

    error AlreadyVerified();
    error InvalidAddress(address caller);
    error RegistrationAlreadyRequested();

    /**
    * @title Submits a identity registration request.
    * @notice It is assumed that the KWC is done through a third party that deliver
    *         the identity ID to the caller
    * @param _stakeholder stakeholder struct. Check RegistryData.sol
    */
    function submitRegistrationRequest(
        RegistryData.Stakeholder calldata _stakeholder
    ) external {
        if (msg.sender != _stakeholder.walletAddress) revert InvalidAddress(_stakeholder.walletAddress);
        if (_status[msg.sender] == RegistrationStatus.REQUESTED) revert RegistrationAlreadyRequested();
        if (_status[msg.sender] == RegistrationStatus.VERIFIED) revert AlreadyVerified();

        _status[msg.sender] == RegistrationStatus.REQUESTED;
        _stakeholders[msg.sender] = _stakeholder;
    }

    /**
    * @title Registers a stakeholder.
    * @notice Changes the status to VERIFIED. Can only be called by the contract owner
    * @param _stakeholderAddress the stakeholder account address
    */
    function register(
        address _stakeholderAddress
    ) external onlyOwner {
        require(_status[_stakeholderAddress] == RegistrationStatus.REQUESTED, "InvalidRequest");

        _status[_stakeholderAddress] = RegistrationStatus.VERIFIED;
    }

    /**
    * @title Rejects a stakeholder registration.
    * @notice Changes the status to REJECTED. Can only be called by the contract owner
    * @param _stakeholderAddress the stakeholder account address
    */
    function reject(
        address _stakeholderAddress
    ) external onlyOwner {
        require(_status[_stakeholderAddress] == RegistrationStatus.REQUESTED, "InvalidRequest");

        _status[_stakeholderAddress] = RegistrationStatus.REJECTED;
    }

    /**
    * @title Check if an account has been approved
    * @notice Returns true if approved, false otherwise
    * @param _stakeholderAddress the stakeholder account address
    */
    function isVerified(
        address _stakeHolderAddress
    ) external view returns(bool) {
        return _status[_stakeholderAddress] == RegistrationStatus.VERIFIED ? true : false;
    }

    /**
    * @title Returns a stakeholder struct. Check RegistryData.sol
    * @param _stakeholderAddress the stakeholder account address
    */
    function getStakeHolder(
        address _stakeHolderAddress
    ) external view returns(RegistryData.Stakeholder memory) {
        return _stakeholders[_stakeHolderAddress];
    }
}