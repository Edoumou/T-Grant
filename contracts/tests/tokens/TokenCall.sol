// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./IERC20.sol";

contract TokenCall {
    address toposManager;
    address[] tokenAddresses;
    string[] tokenSymbols;

    constructor() {
        toposManager = msg.sender;
    }

    modifier onlyBankManager {
        require(msg.sender == toposManager, "TokenCall: ONLY_MANAGER");
        _;
    }

    function addTokenAddress(address _tokenAddress) public onlyBankManager {
        tokenAddresses.push(_tokenAddress);
        tokenSymbols.push(IERC20(_tokenAddress).symbol());
    }

    function getTokenAddresses() public view returns(address[] memory) {
        return tokenAddresses;
    }

    function getTokenSymbols() public view returns(string[] memory) {
        return tokenSymbols;
    }

    function name(address _tokenAddress) external view returns (string memory) {
        return IERC20(_tokenAddress).name();
    }

    function symbol(address _tokenAddress) external view returns (string memory) {
        return IERC20(_tokenAddress).symbol();
    }

    function totalSupply(address _tokenAddress) external view returns (uint256) {
        return IERC20(_tokenAddress).totalSupply();
    }

    function balanceOf(address account, address _tokenAddress) external view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(account);
    }

    function transfer(address to, uint256 amount, address _tokenAddress) external returns (bool) {
        IERC20(_tokenAddress).transfer(to, amount);

        return true;
    }

    function allowance(address owner, address spender, address _tokenAddress) external view returns (uint256) {
        return IERC20(_tokenAddress).allowance(owner, spender);
    }

    function approve(address spender, uint256 amount, address _tokenAddress) external returns (bool) {
        IERC20(_tokenAddress).approve(spender, amount);

        return true;
    }

    function transferFrom(address from, address to, uint256 amount, address _tokenAddress) external returns (bool) {
        IERC20(_tokenAddress).transferFrom(from, to, amount);

        return true;
    }

    function mint(address account, uint256 amount, address _tokenAddress) external returns(bool) {
        IERC20(_tokenAddress).mint(account, amount);
        
        return true;
    } 

    function burn(address account, uint256 amount, address _tokenAddress) external returns(bool) {
        IERC20(_tokenAddress).burn(account, amount);
        
        return true;
    }
}