// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../tests/tokens/IERC20.sol";
import "./IIssuersFund.sol";

contract IssuersFund is IIssuersFund {
    mapping(string => uint256) public totalAmount;

    address public bankContract;

    modifier onlyBankContract {
        require(msg.sender == bankContract, "IssuersFund: ONLY_BANK");
        _;
    }

    constructor(address _bankContract) {
        bankContract = _bankContract;
    }

    function addFund(string memory _dealID, uint256 _amount) external onlyBankContract {
        uint256 previousAmount = totalAmount[_dealID];

        totalAmount[_dealID] = previousAmount + _amount;
    }

    function withdrawFund(string memory _dealID, address _issuer, address _tokenAddress) external onlyBankContract {
        uint256 _amount = totalAmount[_dealID];

        IERC20(_tokenAddress).transferFrom(address(this), _issuer, _amount * 1 ether);

        totalAmount[_dealID] = 0;
    }
}