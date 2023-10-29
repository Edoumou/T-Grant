// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./RegistryData.sol";

interface IIdentityRegistry {
    function isVerified(
        address _stakeHolderAddress
    ) external view returns(bool);

    function submitRegistrationRequest(
        RegistryData.Stakeholder calldata _stakeholder
    ) external;
}