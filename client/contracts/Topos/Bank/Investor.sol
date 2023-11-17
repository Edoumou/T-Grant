// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../BondData.sol";
import "..//interfaces/IRoles.sol";
import "../interfaces/IToposBank.sol";
import "../../Registry/IIdentityRegistry.sol";

contract Investor {
    mapping(address => BondData.Investor) public investors;

    address public toposBankContract;

    BondData.Investor[] listOfInvestors;

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
        address investorAddress = _investor.walletAddress;

        require(msg.sender == _investor.walletAddress, "INVALID_ADDRESS");
        require(
            investors[investorAddress].status == BondData.StakeHolderStatus.UNDEFINED,
            "CHECK_YOUR_STATUS"
        );

        investors[investorAddress] = _investor;
        investors[investorAddress].status = BondData.StakeHolderStatus.SUBMITTED;
        investors[investorAddress].index = listOfInvestors.length;

        listOfInvestors.push(investors[investorAddress]);

        emit RequestInvestorRegistration(investorAddress);
    }

    /**
    * @notice Approves an investor registration request. Can be called only by Topos manager
    * @param _investorAddress investor's account address
    */
    function approveInvestor(address _investorAddress) external {
        BondData.Investor memory _investor = investors[_investorAddress];

        (address toposManager, address rolesContract, , ,) = IToposBank(toposBankContract).getContracts();

        require(msg.sender == toposManager, "ONLY_TOPOS_MANAGER");
        require(
            _investor.status == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        investors[_investorAddress].status = BondData.StakeHolderStatus.APPROVED;
        listOfInvestors[_investor.index].status = BondData.StakeHolderStatus.APPROVED;
        IRoles(rolesContract).setRole("INVESTOR", _investorAddress);

        emit ApproveInvestor(_investorAddress);
    }

    /**
    * @notice Rejects an investor registration request. Can be called only by Topos manager
    * @param _investorAddress investor's account address
    */
    function rejectInvestor(address _investorAddress) external {
        BondData.Investor memory _investor = investors[_investorAddress];

        (address toposManager, , , ,) = IToposBank(toposBankContract).getContracts();

        require(msg.sender == toposManager, "ONLY_TOPOS_MANAGER");
        require(
            _investor.status == BondData.StakeHolderStatus.SUBMITTED,
            "CHECK_YOUR_STATUS"
        );

        investors[_investorAddress].status = BondData.StakeHolderStatus.REJECTED;
        listOfInvestors[_investor.index].status = BondData.StakeHolderStatus.REJECTED;

        emit RejectInvestor(_investorAddress);
    }

    function getInvestors() external view returns(BondData.Investor[] memory) {
        return listOfInvestors;
    }
}