// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../interfaces/IToposBank.sol";
import "./ToposBankStorage.sol";
import "../interfaces/IRoles.sol";
import "../../tests/tokens/IERC20.sol";
import "../../treasury/IIssuersFund.sol";
import "../IRS/IIRS.sol";

contract ToposBank is IToposBank, ToposBankStorage {
    constructor(
        address _toposManager,
        address _rolesContract,
        address _identityRegistryContract,
        address _bondCallContract,
        address _irsCallContract,
        uint256 _dealFees
    ) {
        toposManager = _toposManager;
        rolesContract = _rolesContract;
        identityRegistryContract = _identityRegistryContract;
        bondCallContract = _bondCallContract;
        irsCallContract = _irsCallContract;
        dealFees = _dealFees;
    }

    function setManager(address _toposManager) external onlyToposManager {
        IRoles(rolesContract).setRole("MANAGER", _toposManager);
    }

    function setBenchmark(uint256 _benchmark) external onlyToposManager {
        benchmark = _benchmark;
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
            "not issuer"
        );
        require(
            msg.sender == _deal.issuerAddress,
            "address"
        );
        require(
            deals[_dealID].status == BondData.DealStatus.UNDEFINED,
            "status"
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
            "status"
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
            "status"
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
        if(deals[_dealID].status != BondData.DealStatus.APPROVED)
            revert BondData.InvalidDealStatus(_dealID);

        if((_amount * deals[_dealID].denomination) % deals[_dealID].denomination != 0)
            revert BondData.InvalidAmount(_amount);

        require(
            _amount != 0 && _amount + totalAmountInvestedForDeal[_dealID] <= deals[_dealID].debtAmount,
            "amount"
        );

        totalAmountInvestedForDeal[_dealID] = totalAmountInvestedForDeal[_dealID] + _amount;

        if(amountInvested[msg.sender][_dealID].hasInvested) {
            dealInvestment[_dealID][amountInvested[msg.sender][_dealID].index].amount = amountInvested[msg.sender][_dealID].amount + _amount;
            amountInvested[msg.sender][_dealID].amount = amountInvested[msg.sender][_dealID].amount + _amount;
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

        deals[_dealID].status = BondData.DealStatus.ISSUED;
        listOfDeals[deals[_dealID].index].status = BondData.DealStatus.ISSUED;
        issuerDeals[deals[_dealID].issuerAddress].push(deals[_dealID]);
        bondsDealIDs.push(_dealID);

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

        deals[_dealID].status = BondData.DealStatus.REDEEMED;
        listOfDeals[deals[_dealID].index].status = BondData.DealStatus.REDEEMED;
        issuerDeals[deals[_dealID].issuerAddress][deals[_dealID].index].status = BondData.DealStatus.REDEEMED;

        IBonds(_bondContract).redeem();

        for(uint256 i; i < dealInvestment[_dealID].length; i++) {
            uint256 principal = dealInvestment[_dealID][i].amount;
            address investor = dealInvestment[_dealID][i].investor;

            if (principal != 0) {
                IERC20(deals[_dealID].currency).transfer(investor, principal * 1 ether);
            }
        }

        emit BondRedeem(_dealID);
    }

    /**
    * @notice Swaps interest rates
    * @param _swapContract the ERC-7586 IRS swap contract address
    */
    function swapIRS(
        address _swapContract
    ) external onlyToposManager {
        IIRS(_swapContract).swap();
    }

    function endSwapContract(
        address _swapContract
    ) external onlyToposManager {
        IIRS(_swapContract).terminateSwap();
    }

    function setIRSBenchmark(
        uint256 _newBenchmark,
        address _swapContract
    ) external onlyToposManager {
        IIRS(_swapContract).setBenchmark(_newBenchmark);
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

        require(
            msg.sender == deals[_dealID].issuerAddress || msg.sender == toposManager,
            "address"
        );
        require(deals[_dealID].currency != address(0), "token");

        IIssuersFund(issuersFundContract).withdrawFund(
            _dealID,
            deals[_dealID].issuerAddress,
            deals[_dealID].currency
        );
    }

    // MUST only be called by the bond factory contract in production
    function setBondContractAddress(
        string memory _dealID,
        address _bondContractAddress
    ) external {
        dealBondContracts[_dealID] = _bondContractAddress;
    }

    // MUST only be called by the IRS factory contract in production
    function setIRSContractAddress(
        address _fixedPayerContract,
        address _floatingPayerContract,
        address _irsContractAddress
    ) external {
        irsContracts[_fixedPayerContract][_floatingPayerContract] = _irsContractAddress;
    }

    function setIssuerFundContract(
        address _issuerFundContract
    ) external onlyToposManager {
        require(_issuerFundContract != address(0));

        issuersFundContract = _issuerFundContract;
    }

    function getDeal(
        string memory _dealID
    ) external view returns(BondData.Deal memory) {
        return deals[_dealID];
    }

    function getDealBondContract(
        string memory _dealID
    ) external view returns(address) {
        return dealBondContracts[_dealID];
    }

    function getListOfDeals() external view returns(BondData.Deal[] memory) {
        return listOfDeals;
    }

    function getListOfBonds() external view returns(BondData.Bond[] memory) {
        return bonds;
    }

    function getListOfBondsDealIDs() external view returns(string[] memory) {
        return bondsDealIDs;
    }

    function getContracts() external view returns(
        address manager,
        address roles,
        address identityRegistry,
        address bondCall,
        address issuerFund
    ) {
        (   
            manager,
            roles,
            identityRegistry,
            bondCall,
            issuerFund
        ) = (
            toposManager,
            rolesContract,
            identityRegistryContract,
            bondCallContract,
            issuersFundContract
        );
    }
}