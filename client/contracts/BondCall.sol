// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./IERC7092.sol";
import "./BondData.sol";
import "./Topos/interfaces/IBondStorage.sol";

contract BondCall {
    function isin(address _bondContract) external view returns(string memory) {
        return IERC7092(_bondContract).isin();
    }

    function name(address _bondContract) external view returns(string memory) {
        return IERC7092(_bondContract).name();
    }

    function symbol(address _bondContract) external view returns(string memory) {
        return IERC7092(_bondContract).symbol();
    }

    function currency(address _bondContract) external view returns(address) {
        return IERC7092(_bondContract).currency();
    }

    function denomination(address _bondContract) external view returns(uint256) {
        return IERC7092(_bondContract).denomination();
    }

    function issueVolume(address _bondContract) external view returns(uint256) {
        return IERC7092(_bondContract).issueVolume();
    }

    function couponRate(address _bondContract) external view returns(uint256) {
        return IERC7092(_bondContract).couponRate();
    }

    function couponType(address _bondContract) external view returns(uint256) {
        return IERC7092(_bondContract).couponType();
    }

    function couponFrequency(address _bondContract) external view returns(uint256) {
        return IERC7092(_bondContract).couponFrequency();
    }

    function issueDate(address _bondContract) external view returns(uint256) {
        return IERC7092(_bondContract).issueDate();
    }

    function maturityDate(address _bondContract) external view returns(uint256) {
        return IERC7092(_bondContract).maturityDate();
    }

    function principalOf(address _account, address _bondContract) external view returns(uint256) {
        return IERC7092(_bondContract).principalOf(_account);
    }

    function allowance(address _owner, address _spender, address _bondContract) external view returns(uint256) {
        return IERC7092(_bondContract).allowance(_owner, _spender);
    }

    function approve(address _spender, uint256 _amount, address _bondContract) external {
        IERC7092(_bondContract).approve(_spender, _amount);
    }

    function decreaseAllowance(address _spender, uint256 _amount, address _bondContract) external {
        IERC7092(_bondContract).decreaseAllowance(_spender, _amount);
    }

    function transfer(address _to, uint256 _amount, bytes calldata _data, address _bondContract) external {
        IERC7092(_bondContract).transfer(_to, _amount, _data);
    }

    function transferFrom(address _from, address _to, uint256 _amount, bytes calldata _data, address _bondContract) external {
        IERC7092(_bondContract).transferFrom(_from, _to, _amount, _data);
    }

    function dealID(address _bondContract) external view returns(string memory) {
        return IBondStorage(_bondContract).dealID();
    }

    function countryOfIssuance(address _bondContract) external view returns(string memory) {
        return IBondStorage(_bondContract).countryOfIssuance();
    }

    function bondManager(address _bondContract) external view returns(address) {
        return IBondStorage(_bondContract).bondManager();
    }

    function bankContract(address _bondContract) external view returns(address) {
        return IBondStorage(_bondContract).bankContract();
    }

    function bondCallContract(address _bondContract) external view returns(address) {
        return IBondStorage(_bondContract).bondCallContract();
    }

    function bondStatus(address _bondContract) external view returns(BondData.BondStatus) {
        return IBondStorage(_bondContract).bondStatus();
    }

    function listOfInvestors(address _bondContract) external view returns(BondData.DealInvestment[] memory) {
        return IBondStorage(_bondContract).getListOfInvestors();
    }

    function bondInfo(address _bondContract) external view returns(BondData.Bond memory) {
        return IBondStorage(_bondContract).bondInfo();
    }

    function issuerInfo(address _bondContract) external view returns(address) {
        return IBondStorage(_bondContract).issuerInfo();
    }

    function isInvestors(address _account, address _bondContract) external view returns(bool) {
        return IBondStorage(_bondContract).isInvestors(_account);
    }
}