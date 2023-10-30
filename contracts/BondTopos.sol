// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./IERC7092.sol";
import "./BondStorage.sol";

contract BondTopos is IERC7092, BondStorage {
    function isin() external view returns(string memory) {
        return bonds[dealID].isin;
    }

    function name() external view returns(string memory) {
        return bonds[dealID].name;
    }

    function symbol() external view returns(string memory) {
        return bonds[dealID].symbol;
    }

    function currency() external view returns(address) {
        return bonds[dealID].currency;
    }

    function denomination() external view returns(uint256) {
        return bonds[dealID].denomination;
    }

    function issueVolume() external view returns(uint256) {
        return bonds[dealID].issueVolume;
    }

    function couponRate() external view returns(uint256) {
        return bonds[dealID].couponRate;
    }

    function couponType() external view returns(uint8) {
        return bonds[dealID].couponType;
    }

    function couponFrequency() external view returns(uint256) {
        return bonds[dealID].couponFrequency;
    }

    function issueDate() external view returns(uint256) {
        return bonds[dealID].issueDate;
    }

    function maturityDate() external view returns(uint256) {
        return bonds[dealID].maturityDate;
    }

    function principalOf(address _account) external view returns(uint256) {

    }

    function allowance(address _owner, address _spender) external view returns(uint256) {

    }

    function approve(address _spender, uint256 _amount) external returns(bool) {

    }

    function decreaseAllowance(address _spender, uint256 _amount) external {

    }

    function transfer(address _to, uint256 _amount, bytes calldata _data) external returns(bool) {

    }

    function transferFrom(address _from, address _to, uint256 _amount, bytes calldata _data) external returns(bool) {

    }
}