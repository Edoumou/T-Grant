// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../BondData.sol";
import "..//interfaces/IRoles.sol";
import "../interfaces/IToposBank.sol";
import "../../Registry/IIdentityRegistry.sol";

contract Investor {
    mapping(address => BondData.Investor) public investors;
    mapping(address => BondData.StakeHolderStatus) public investorStatus;

    address public toposBankContract;

    event ApproveInvestor(address investor);
    event RejectInvestor(address investor);
    event RequestInvestorRegistration(address investor);

    modifier onlyToposBankContract {
        require(
            msg.sender == toposBankContract,
            "ONLY_TOPOS_BANK"
        );
        _;
    }

    modifier mustBeApproved(address _investor) {
        (, , address registry, , ) = IToposBank(toposBankContract).getContracts();

        require(
            IIdentityRegistry(registry).isVerified(_investor),
            "ACCOUNT_NOT_AAPROVED"
        );
        _;
    }

    constructor(address _toposBankContract) {
        toposBankContract =_toposBankContract;
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
    * @notice Approves an investor registration request. Can be called only by Topos manager
    * @param _investor investor's account address
    */
    function approveInvestor(address _investor) external {
        (address toposManager, address rolesContract, , ,) = IToposBank(toposBankContract).getContracts();

        require(msg.sender == toposManager, "ONLY_TOPOS_MANAGER");
        require(
            investorStatus[_investor] == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        investorStatus[_investor] = BondData.StakeHolderStatus.APPROVED;
        IRoles(rolesContract).setRole("INVESTOR", _investor);

        emit ApproveInvestor(_investor);
    }

    /**
    * @notice Rejects an investor registration request. Can be called only by Topos manager
    * @param _investor investor's account address
    */
    function rejectInvestor(address _investor) external {
        (address toposManager, , , ,) = IToposBank(toposBankContract).getContracts();

        require(msg.sender == toposManager, "ONLY_TOPOS_MANAGER");
        require(
            investorStatus[_investor] == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        investorStatus[_investor] = BondData.StakeHolderStatus.REJECTED;

        emit RejectInvestor(_investor);
    }
}