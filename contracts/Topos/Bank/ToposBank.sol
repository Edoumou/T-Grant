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
            issuerStatus[msg.sender] == BondData.StakeHolderStatus.UNDEFINED,
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
            investorStatus[msg.sender] == BondData.StakeHolderStatus.UNDEFINED,
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

    function rejectIssuer(address _issuer) external onlyToposManager {
        require(
            issuerStatus[_issuer] == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        issuerStatus[_issuer] = BondData.StakeHolderStatus.REJECTED;
    }

    function rejectInvestor(address _investor) external onlyToposManager {
        require(
            investorStatus[_investor] == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        investorStatus[_investor] = BondData.StakeHolderStatus.REJECTED;
    }

    function submitDeal(
        string calldata _dealID,
        BondData.Deal calldata _deal
    ) external {
        require(
            IRoles(rolesContract).isIssuer(msg.sender),
            "ONLY_ISSUERS"
        );
        require(
            msg.sender == _deal.issuerAddress,
            "INVALID_ISSUER_ADDRESS"
        );
        require(
            deals[_dealID].status == BondData.DealStatus.UNDEFINED,
            "INVALID_DEAL_STATUS"
        );

        deals[_dealID] = _deal;
        deals[_dealID].status = BondData.DealStatus.SUBMITTED;
        deals[_dealID].index = listOfDeals.length;

        listOfDeals.push(deals[_dealID]);

        emit DealSubmitted(_dealID, _deal);
    }

    function approveDeal(
        string calldata _dealID
    ) external onlyToposManager {
        require(
            deals[_dealID].status == BondData.DealStatus.SUBMITTED,
            "INVALID_DEAL_STATUS"
        );

        deals[_dealID].status = BondData.DealStatus.APPROVED;
        listOfDeals[deals[_dealID].index].status = BondData.DealStatus.APPROVED;

        emit DealAPproved(_dealID);
    }

    function rejectDeal(
        string calldata _dealID
    ) external onlyToposManager {
        require(
            deals[_dealID].status == BondData.DealStatus.SUBMITTED,
            "INVALID_DEAL_STATUS"
        );

        deals[_dealID].status = BondData.DealStatus.REJECTED;
        listOfDeals[deals[_dealID].index].status = BondData.DealStatus.REJECTED;

        emit DealARejected(_dealID);
    }

    function registerForDeal(
        string calldata _dealID,
        uint256 _amount
    ) external mustBeApproved(msg.sender) {
        if(deals[_dealID].status != BondData.DealStatus.APPROVED)
            revert BondData.InvalidDealStatus(_dealID);
        require(_amount != 0, "INVALID_AMOUNT");

        bool hasInvested = amountInvested[msg.sender][_dealID].hasInvested;

        if(hasInvested) {
            uint256 index = amountInvested[msg.sender][_dealID].index;
            uint256 amount  = amountInvested[msg.sender][_dealID].amount;

            dealInvestment[_dealID][index].amount = amount + _amount;
            amountInvested[msg.sender][_dealID].amount = amount + _amount;
        } else {
            amountInvested[msg.sender][_dealID] =  BondData.Investment(
                {
                    amount: _amount,
                    hasInvested: true,
                    index: dealInvestment[_dealID].length
                }
            );

            dealInvestment[_dealID].push(
                BondData.DealInvestment(
                    {
                        investor: msg.sender,
                        amount: _amount
                    }
                )
            );       
        }
    }

    function issue(string calldata _delaID) external onlyToposManager {

    }

    function redeem() external onlyToposManager {

    }
}