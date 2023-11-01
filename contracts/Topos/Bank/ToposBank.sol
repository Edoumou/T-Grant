// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../interfaces/IToposBank.sol";
import "./ToposBankStorage.sol";
import "../interfaces/IRoles.sol";

contract ToposBank is IToposBank, ToposBankStorage {
    constructor(
        address _toposManager,
        address _rolesContract,
        address _identityRegistryContract
    ) {
        toposManager = _toposManager;
        rolesContract = _rolesContract;
        IRoles(_rolesContract).setRole("MANAGER", _toposManager);
        identityRegistryContract = _identityRegistryContract;
    }

    function requestRegistrationIssuer(
        BondData.Issuer calldata _issuer
    ) external mustBeApproved(_issuer.walletAddress) {
        require(msg.sender == _issuer.walletAddress, "INVALID_ADDRESS");
        require(
            issuerStatus[msg.sender] == BondData.StakeHolderStatus.UNKNOWN,
            "CHECK_YOUR_STATUS"
        );

        issuers[_issuer.walletAddress] = _issuer;
        issuerStatus[msg.sender] = BondData.StakeHolderStatus.SUBMITTED;
    }

    function requestRegistrationInvestor(
        BondData.Investor calldata _investor
    ) external mustBeApproved(_investor.walletAddress) {
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

        issuerStatus[_issuer] = BondData.StakeHolderStatus.APPROVED;
        IRoles(rolesContract).setRole("ISSUER", _issuer);
    }

    function approveInvestor(address _investor) external onlyToposManager {
        require(
            investorStatus[_investor] == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        investorStatus[_investor] = BondData.StakeHolderStatus.APPROVED;
        IRoles(rolesContract).setRole("INVESTOR", _investor);
    }

    function rejectIssuer(address _issuer) external view onlyToposManager {
        require(
            issuerStatus[_issuer] == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        issuerStatus[_issuer] = BondData.StakeHolderStatus.REJECTED;
    }

    function rejectInvestor(address _investor) external view onlyToposManager {
        require(
            investorStatus[_investor] == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        investorStatus[_investor] = BondData.StakeHolderStatus.REJECTED;
    }

    function submitDeal(
        string calldata _delaID,
        BondData.Deal calldata _deal
    ) external {
        require(
            IRoles(rolesContract).getRole(msg.sender) == "ISSUER",
            "ONLY_ISSUERS"
        );
        require(
            msg.sender == _deal.issuerAddress,
            "INVALID_ISSUER_ADDRESS"
        );
        require(
            deals[_delaID].status == DealStatus.UNKNOWN,
            "INVALID_DEAL_STATUS"
        );

        deals[_delaID] = _deal;
        deals[_delaID].status = DealStatus.SUBMITTED;
        deals[_delaID].index = listOfDeals.length;

        listOfDeals.push(deals[_delaID]);
        issuerDeals.push(deals[_delaID]);
        issuerDealStatus[msg.sender].push(DealStatus.SUBMITTED);
    }

    function approveDeal(
        string calldata _delaID
    ) external onlyToposManager {
        require(
            deals[_delaID].status == DealStatus.SUBMITTED,
            "INVALID_DEAL_STATUS"
        );

        deals[_delaID].status = DealStatus.APPROVED;
        listOfDeals[deals[_delaID].index].status = DealStatus.APPROVED;
        issuerDealStatus[deals[_dealID].issuerAddress].push(DealStatus.APPROVED);
    }

    function rejectDeal() external onlyToposManager {

    }

    function issue(string calldata _delaID) external onlyToposManager {

    }

    function redeem() external onlyToposManager {

    }
}