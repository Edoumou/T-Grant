// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../interfaces/IToposBank.sol";
import "./ToposBankStorage.sol";
import "../interfaces/IRoles.sol";
import "../interfaces/IBonds.sol";
import "../../tests/tokens/IERC20.sol";
import "../../treasury/IIssuersFund.sol";

contract ToposBank is IToposBank, ToposBankStorage {
    constructor(
        address _toposManager,
        address _rolesContract,
        address _identityRegistryContract,
        uint256 _dealFees
    ) {
        toposManager = _toposManager;
        rolesContract = _rolesContract;
        IRoles(_rolesContract).setRole("MANAGER", _toposManager);
        identityRegistryContract = _identityRegistryContract;
        dealFees = _dealFees;
    }

    /**
    * @notice Sends an registration request to become an issuer.
    * @param _issuer Issuer struct. See BondData.sol
    */
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

        emit RequestIssuerRegistration(_issuer.walletAddress);
    }

    /**
    * @notice Sends an registration request to become an investor.
    * @param _investor Investor struct. See BondData.sol
    */
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

        emit RequestInvestorRegistration(_investor.walletAddress);
    }

    /**
    * @notice Approves an issuer registration request. Can be called only by Topos manager
    * @param _issuer issuer's account address
    */
    function approveIssuer(address _issuer) external onlyToposManager {
        require(
            issuerStatus[_issuer] == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        issuerStatus[_issuer] = BondData.StakeHolderStatus.APPROVED;
        IRoles(rolesContract).setRole("ISSUER", _issuer);

        emit ApproveIssuer(_issuer);
    }

    /**
    * @notice Approves an investor registration request. Can be called only by Topos manager
    * @param _investor investor's account address
    */
    function approveInvestor(address _investor) external onlyToposManager {
        require(
            investorStatus[_investor] == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        investorStatus[_investor] = BondData.StakeHolderStatus.APPROVED;
        IRoles(rolesContract).setRole("INVESTOR", _investor);

        emit ApproveInvestor(_investor);
    }

    /**
    * @notice Rejects an issuer registration request. Can be called only by Topos manager
    * @param _issuer issuer's account address
    */
    function rejectIssuer(address _issuer) external onlyToposManager {
        require(
            issuerStatus[_issuer] == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        issuerStatus[_issuer] = BondData.StakeHolderStatus.REJECTED;

        emit RejectIssuer(_issuer);
    }

    /**
    * @notice Rejects an investor registration request. Can be called only by Topos manager
    * @param _investor investor's account address
    */
    function rejectInvestor(address _investor) external onlyToposManager {
        require(
            investorStatus[_investor] == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        investorStatus[_investor] = BondData.StakeHolderStatus.REJECTED;

        emit RejectInvestor(_investor);
    }

    /**
    * @notice Submits a deal. Can be called only by registered issuers
    * @param _dealID the deal ID
    * @param _deal deal struct containing deal information - see BondData.sol
    */
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

    /**
    * @notice Approves a deal. Can be called only by Topos Manager
    * @param _dealID the deal ID
    */
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

    /**
    * @notice Rejects a deal. Can be called only by Topos Manager
    * @param _dealID the deal ID
    */
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

    /**
    * @notice Investors call this function to register for a Deal
    *         Investors must submit the amount the want to invest
    * @param _dealID the deal ID
    * @param _amount Amount to invest - in bond currency unit
    */
    function registerForDeal(
        string calldata _dealID,
        uint256 _amount
    ) external mustBeApproved(msg.sender) {
        uint256 _totalAmountInvested = totalAmountInvestedForDeal[_dealID];

        if(deals[_dealID].status != BondData.DealStatus.APPROVED)
            revert BondData.InvalidDealStatus(_dealID);
        require(
            _amount != 0 && _amount + _totalAmountInvested <= deals[_dealID].debtAmount,
            "INVALID_AMOUNT"
        );

        bool hasInvested = amountInvested[msg.sender][_dealID].hasInvested;
        totalAmountInvestedForDeal[_dealID] = _totalAmountInvested + _amount;

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

        IIssuersFund(issuersFundContract).addFund(_dealID, _amount);
        IERC20(
            deals[_dealID].currency
        ).transferFrom(
            msg.sender, issuersFundContract, _amount * 1 ether
        );

        emit RegisterForDeal(_dealID, msg.sender);
    }

    /**
    * @notice Issues bonds to investors. Can be called only by Topos Manager
    * @param _dealID the deal ID
    * @param _bond bond struct containing bond information - see BondData.sol
    * @param _bondContract the ERC-7092 bond contract address
    */
    function issue(
        string calldata _dealID,
        BondData.Bond calldata _bond,
        address _bondContract
    ) external onlyToposManager {
        if(deals[_dealID].status != BondData.DealStatus.APPROVED)
            revert BondData.InvalidDealStatus(_dealID);

        dealBondContracts[_dealID] = _bondContract;

        deals[_dealID].status != BondData.DealStatus.ISSUED;
        listOfDeals[deals[_dealID].index].status = BondData.DealStatus.ISSUED;
        issuerDeals[deals[_dealID].issuerAddress].push(deals[_dealID]);

        IBonds(_bondContract).issue(_bond);

        bonds.push(_bond);

        emit BondIssue(_dealID);
    }

    /**
    * @notice Redeem bonds. Can be called only by Topos Manager
    * @param _dealID the deal ID
    * @param _bondContract the ERC-7092 bond contract address
    */
    function redeem(
        string calldata _dealID,
        address _bondContract
    ) external onlyToposManager {
        if(deals[_dealID].status != BondData.DealStatus.ISSUED)
            revert BondData.InvalidDealStatus(_dealID);

        deals[_dealID].status != BondData.DealStatus.REDEEMED;
        listOfDeals[deals[_dealID].index].status = BondData.DealStatus.REDEEMED;
        issuerDeals[deals[_dealID].issuerAddress][deals[_dealID].index].status = BondData.DealStatus.REDEEMED;

        IBonds(_bondContract).redeem();

        emit BondRedeem(_dealID);
    }

    function getTotalAmounInvested(
        string calldata _dealID
    ) external view returns(uint256) {
        return totalAmountInvestedForDeal[_dealID];
    }

    function getDealInvestment(
        string calldata _dealID
    ) external view returns(BondData.DealInvestment[] memory) {
        return dealInvestment[_dealID];
    }

    /**
    * @notice Returns the deal fees in bips
    *         1 bips = 0.01% = 0.0001
    *         ex: if interest rate = 5%, then `dealFees = 500`
    */
    function getDealFees() external view returns(uint256) {
        return dealFees;
    }

    /**
    * @notice Transfer deal funds to issuer. Can be called either by the issuer or by the Topos manager
    * @param _dealID deal ID
    */
    function withdrawIssuerFund(
        string memory _dealID
    ) external {
        address issuer = deals[_dealID].issuerAddress;
        address tokenAddress = deals[_dealID].currency;

        require(
            msg.sender == issuer || msg.sender == toposManager, "NOT_ISSUER_NOR_TOPOS_MANAGER"
        );
        require(tokenAddress != address(0), "INVALID_TOKEN_ADDRESS");

        IIssuersFund(issuersFundContract).withdrawFund(_dealID, issuer, tokenAddress);
    }

    function setBondContractAddress(
        string memory _dealID,
        address _bondContractAddress
    ) external {
        dealBondContracts[_dealID] = _bondContractAddress;
    }

    function setIssuerFundContract(
        address _issuerFundContract
    ) external onlyToposManager {
        require(_issuerFundContract != address(0), "INVALID_CONTRACT_ADDRESS");

        issuersFundContract = _issuerFundContract;
    }
}