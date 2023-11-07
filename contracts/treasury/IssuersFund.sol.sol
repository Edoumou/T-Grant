// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../tests/tokens/IERC20.sol";
import "./IIssuersFund.sol";
import "./IToposTreasury.sol";
import "../Topos/interfaces/IToposBank.sol";

contract IssuersFund is IIssuersFund {
    mapping(string => uint256) public totalAmount;

    address public toposManager;
    address public toposBankContract;
    address public toposTreasury;

    modifier onlyToposManager {
        require(
            msg.sender == toposManager,
            "NOT_ALLOWED"
        );
        _;
    }

    modifier onlyBankContract {
        require(msg.sender == toposBankContract, "IssuersFund: ONLY_BANK");
        _;
    }

    constructor(address _bankContract, address _toposTreasury) {
        toposManager = msg.sender;
        toposBankContract = _bankContract;
        toposTreasury = _toposTreasury;
    }

    function addFund(string memory _dealID, uint256 _amount) external onlyBankContract {
        uint256 previousAmount = totalAmount[_dealID];

        totalAmount[_dealID] = previousAmount + _amount;
    }

    function withdrawFund(string memory _dealID, address _issuer, address _tokenAddress) external onlyBankContract {
        uint256 _amount = totalAmount[_dealID];

        uint256 fees = IToposBank(toposBankContract).getDealFees();

        IERC20(_tokenAddress).transferFrom(address(this), toposTreasury, (fees * 1 ether) / 10000);
        IERC20(_tokenAddress).transferFrom(address(this), _issuer, (10000 * _amount - fees) * 1 ether / 10000);

        totalAmount[_dealID] = 0;
    }

    /**
    * @notice Allows to withdraw tokens sent accidently. Issuers funds deposits are done through `addFund`
    * @param _to account address to send tokens to
    * @param _amount amount of tokens to send
    * @param _tokenAddress the token contract address
    */
    function withdraw(address _to, uint256 _amount, address _tokenAddress) external onlyToposManager {
        uint256 availabaleBalance = IERC20(_tokenAddress).balanceOf(address(this));
        require(_amount <= availabaleBalance, "INSUFFICIENT_FUNDS");

        IERC20(_tokenAddress).transferFrom(address(this), _to, _amount);
    }
}