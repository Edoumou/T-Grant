// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../interfaces/IToposBank.sol";
import "./ToposBankStorage.sol";
import "../interfaces/IRoles.sol";

contract ToposBank is IToposBank, ToposBankStorage {
    constructor(address _toposManager) {
        toposManager = _toposManager;
        roles[_toposManager] = "MANAGER";
    }

    function setRolesContract(address _rolesContract) external onlyToposManager {
        rolesContract = _rolesContract;
    }


    function requestRegistrationIssuer(BondData.Issuer calldata _issuer) external {
        require(msg.sender == _issuer.walletAddress, "INVALID_ADDRESS");
        require(
            issuerStatus[msg.sender] == BondData.StakeHolderStatus.UNKNOWN,
            "CHECK_YOUR_STATUS"
        );

        issuers[_issuer.walletAddress] = _issuer;
        issuerStatus[msg.sender] = BondData.StakeHolderStatus.SUBMITTED;
    }

    function requestRegistrationInvestor(BondData.Investor calldata _investor) external {
        require(msg.sender == _investor.walletAddress, "INVALID_ADDRESS");
        require(
            investorStatus[msg.sender] == BondData.StakeHolderStatus.UNKNOWN,
            "CHECK_YOUR_STATUS"
        );

        investors[_investor.walletAddress] = _investor;
        investorStatus[msg.sender] = BondData.StakeHolderStatus.SUBMITTED;
    }

    function approveIssuer(address _issuer) external onlyToposManager {
        require(
            issuerStatus[_issuer] == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        issuerStatus[_issuer] == BondData.StakeHolderStatus.APPROVED;
        IRoles(rolesContract).setRole("ISSUER", _issuer);
    }

    function approveInvestor(address _investor) external onlyToposManager {
        require(
            investorStatus[_investor] == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        investorStatus[_investor] == BondData.StakeHolderStatus.APPROVED;
        IRoles(rolesContract).setRole("INVESTOR", _investor);
    }

    function rejectIssuer(address _issuer) external view onlyToposManager {
        require(
            issuerStatus[_issuer] == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        issuerStatus[_issuer] == BondData.StakeHolderStatus.REJECTED;
    }

    function rejectInvestor(address _investor) external view onlyToposManager {
        require(
            investorStatus[_investor] == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        investorStatus[_investor] == BondData.StakeHolderStatus.REJECTED;
    }

    function submitDeal() external {

    }

    function approveDeal() external onlyToposManager {

    }

    function rejectDeal() external onlyToposManager {

    }

    function issue() external onlyToposManager {

    }

    function redeem() external onlyToposManager {

    }
}