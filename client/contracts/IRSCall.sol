// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./tests/tokens/IERC20.sol";

contract IRSCall {
    function name(address _irsContract) external view returns (string memory) {
        return IERC20(_irsContract).name();
    }

    function symbol(address _irsContract) external view returns (string memory) {
        return IERC20(_irsContract).symbol();
    }

    /*
    function decimals(address _irsContract) external view returns(uint8) {
        return IERC20(_irsContract).
    }
    */

    function totalSupply(address _irsContract) external view returns(uint256) {
        return IERC20(_irsContract).totalSupply();
    }

    function balanceOf(address _account, address _irsContract) external view returns(uint256) {
        return IERC20(_irsContract).balanceOf(_account);
    }

    function allowance(address _owner, address _spender, address _irsContract) external view returns(uint256) {
        return IERC20(_irsContract).allowance(_owner, _spender);
    }

    function approve(address _spender, uint256 _amount, address _irsContract) external {
        IERC20(_irsContract).approve(_spender, _amount);
    }

    function transfer(address _to, uint256 _amount, address _irsContract) external {
        IERC20(_irsContract).transfer(_to, _amount);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount,
        address _irsContract
    ) external {
        IERC20(_irsContract).transferFrom(_from, _to, _amount);
    }

    /**
    *
    */
    function increaseAllowance(
        address _spender,
        uint256 _addedValue,
        address _irsContract
    ) etxernal {
        
    }
}