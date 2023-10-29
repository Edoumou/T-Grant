// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IIdentityRegistry.sol";
import "./RegistryData.sol";

/**
* @notice manages stakeholders identity
*/
contract IdentityRegistrty is IIdentityRegistry, Ownable {
    mapping(address => RegistryData.Stakeholder) private _stakeholders;
    mapping(address => RegistrationStatus) private _status;

    enum RegistrationStatus {UKNOWN, REQUESTED, VERIFIED, REJECTED}

    error AlreadyVerified();
    error InvalidAddress(address caller);
    error RegistrationAlreadyRequested();

    function submitRegistrationRequest(
        RegistryData.Stakeholder calldata _stakeholder
    ) external {
        if (msg.sender != _stakeholder.walletAddress) revert InvalidAddress(_stakeholder.walletAddress);
        if (_status[msg.sender] == RegistrationStatus.REQUESTED) revert RegistrationAlreadyRequested();
        if (_status[msg.sender] == RegistrationStatus.VERIFIED) revert AlreadyVerified();

        _status[msg.sender] == RegistrationStatus.REQUESTED;
        _stakeholders[msg.sender] = _stakeholder;
    }

    function register(
        address _stakeholderAddress
    ) external onlyOwner {
        require(_status[_stakeholderAddress] == RegistrationStatus.REQUESTED, "InvalidRequest");

        _status[_stakeholderAddress] = RegistrationStatus.VERIFIED;
    }

    function reject(
        address _stakeholderAddress
    ) external onlyOwner {
        require(_status[_stakeholderAddress] == RegistrationStatus.REQUESTED, "InvalidRequest");

        _status[_stakeholderAddress] = RegistrationStatus.REJECTED;
    }

    function isVerified(
        address _stakeHolderAddress
    ) external view returns(bool) {
        return _status[_stakeholderAddress] == RegistrationStatus.VERIFIED ? true : false;
    }

    function getStakeHolder(
        address _stakeHolderAddress
    ) external view returns(RegistryData.Stakeholder memory) {
        return _stakeholders[_stakeHolderAddress];
    }
}