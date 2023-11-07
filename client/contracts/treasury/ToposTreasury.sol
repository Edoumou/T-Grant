// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../tests/tokens/IERC20.sol";
import "./IToposTreasury.sol";

contract ToposTreasury is IToposTreasury {
    mapping(string => uint256) public dealFunds;

    address public toposManager;
    address public toposBankContract;

    constructor(address _toposBankContract) {
        toposManager = msg.sender;
        toposBankContract = _toposBankContract;
    }

    modifier onlyToposManager {
        require(
            msg.sender == toposManager,
            "NOT_ALLOWED"
        );
        _;
    }

    modifier onlyToposBankContract {
        require(
            msg.sender == toposBankContract,
            "ONLY_TOPOS_BANK"
        );
        _;
    }

    /**
    * @notice Updates the topos manager account address. Can be called all only by Topos manager
    * @param _newToposManager the new topos manager account address
    */
    function updateToposManager(address _newToposManager) external onlyToposManager {
        toposManager = _newToposManager;
    }

    /**
    * @notice Adds fees collected from deals. Called only by the Topos Bank Contract
    * @param _dealID deal ID
    * @param _amount amount of tokens collected as fees
    */
    function addFunds(string calldata _dealID, uint256 _amount) external onlyToposBankContract {
        dealFunds[_dealID] = _amount;
    }

    /**
    * @notice Withdraws fees collected from deals. Called only by Topos manager
    * @param _dealID deal ID
    * @param _to account address to send tokens to
    * @param _tokenAddress the token contract address
    */
    function withdrawFund(string memory _dealID, address _to, address _tokenAddress) external onlyToposManager {
        uint256 _amount = dealFunds[_dealID];
        require(_amount > 0, "NO_FUNDS");

        IERC20(_tokenAddress).transferFrom(address(this), _to, _amount * 1 ether);

        dealFunds[_dealID] = 0;
    }

    /**
    * @notice Allows to withdraw tokens sent accidently. Fees deposit are done through `addFund`
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