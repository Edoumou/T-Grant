// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./IERC7092.sol";
import "./BondStorage.sol";

contract BondTopos is IERC7092, BondStorage {
    function isin() external view returns(string memory) {
        return _bonds[bondISIN].isin;
    }

    function name() external view returns(string memory) {
        return _bonds[bondISIN].name;
    }

    function symbol() external view returns(string memory) {
        return _bonds[bondISIN].symbol;
    }

    function currency() external view returns(address) {
        return _bonds[bondISIN].currency;
    }

    function denomination() external view returns(uint256) {
        return _bonds[bondISIN].denomination;
    }

    function issueVolume() external view returns(uint256) {
        return _bonds[bondISIN].issueVolume;
    }

    function couponRate() external view returns(uint256) {
        return _bonds[bondISIN].couponRate;
    }

    function couponType() external view returns(uint8) {
        return _bonds[bondISIN].couponType;
    }

    function couponFrequency() external view returns(uint256) {
        return _bonds[bondISIN].couponFrequency;
    }

    function dayCountBasis() external view returns(uint8) {
        return _bonds[bondISIN].dayCountBasis;
    }

    function issueDate() external view returns(uint256) {
        return _bonds[bondISIN].issueDate;
    }

    function maturityDate() external view returns(uint256) {
        return _bonds[bondISIN].maturityDate;
    }

    function principalOf(address _account) external view returns(uint256) {
        return _principals[_account];
    }

    function allowance(address _owner, address _spender) external view returns(uint256) {

    }

    function approve(address _spender, uint256 _amount) external returns(bool) {
        address _owner = msg.sender;
        _approve(_owner, _spender, _amount);

        return true;
    }

    function decreaseAllowance(address _spender, uint256 _amount) external returns(bool) {
        address _owner = msg.sender;

        _decreaseAllowance(_owner, _spender, _amount);

        return true;
    }

    function transfer(address _to, uint256 _amount, bytes calldata _data) external returns(bool) {
        address _from = msg.sender;

        _transfer(_from, _to, _amount, _data);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _amount, bytes calldata _data) external returns(bool) {
        address _spender = msg.sender;

        _spendApproval(_from, _spender, _amount);

        _transfer(_from, _to, _amount, _data);

        return true;
    }

    function _approve(address _owner, address _spender, uint256 _amount) internal virtual {
        require(_owner != address(0), "BondTopos: OWNER_ZERO_ADDRESS");
        require(_spender != address(0), "BondTopos: SPENDER_ZERO_ADDRESS");
        require(_amount > 0, "BondTopos: INVALID_AMOUNT");

        uint256 principal = _principals[_owner];
        uint256 _approval = _approvals[_owner][_spender];
        uint256 _denomination = _bonds[bondISIN].denomination;
        uint256 _maturityDate = _bonds[bondISIN].maturityDate;

        uint256 _balance = principal / _denomination;

        require(block.timestamp < _maturityDate, "BondTopos: BONDS_MATURED");
        require(_amount <= _balance, "BondTopos: INSUFFICIENT_BALANCE");
        require((_amount * _denomination) % _denomination == 0, "BondTopos: INVALID_AMOUNT");

        _approvals[_owner][_spender]  = _approval + _amount;

        emit Approval(_owner, _spender, _amount);
    }

    function _decreaseAllowance(address _owner, address _spender, uint256 _amount) internal virtual {
        require(_owner != address(0), "ERC7092: OWNER_ZERO_ADDRESS");
        require(_spender != address(0), "ERC7092: SPENDER_ZERO_ADDRESS");
        require(_amount > 0, "ERC7092: INVALID_AMOUNT");

        uint256 _approval = _approvals[_owner][_spender];
        uint256 _denomination = _bonds[bondISIN].denomination;
        uint256 _maturityDate = _bonds[bondISIN].maturityDate;

        require(block.timestamp < _maturityDate, "ERC7092: BONDS_MATURED");
        require(_amount <= _approval, "ERC7092: NOT_ENOUGH_APPROVAL");
        require((_amount * _denomination) % _denomination == 0, "ERC7092: INVALID_AMOUNT");

        _approvals[_owner][_spender]  = _approval - _amount;

        emit Approval(_owner, _spender, _amount);
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _amount,
        bytes calldata _data
    ) internal virtual {
        require(_from != address(0), "ERC7092: OWNER_ZERO_ADDRESS");
        require(_to != address(0), "ERC7092: SPENDER_ZERO_ADDRESS");
        require(_amount > 0, "ERC7092: INVALID_AMOUNT");

        uint256 principal = _principals[_from];
        uint256 _denomination = _bonds[bondISIN].denomination;
        uint256 _maturityDate = _bonds[bondISIN].maturityDate;

        uint256 _balance = principal / _denomination;

        require(block.timestamp < _maturityDate, "ERC7092: BONDS_MATURED");
        require(_amount <= _balance, "ERC7092: INSUFFICIENT_BALANCE");
        require((_amount * _denomination) % _denomination == 0, "ERC7092: INVALID_AMOUNT");

        _beforeBondTransfer(_from, _to, _amount, _data);

        uint256 principalTo = _principals[_to];

        unchecked {
            uint256 _principalTransferred = _amount * _denomination;

            _principals[_from] = principal - _principalTransferred;
            _principals[_to] = principalTo + _principalTransferred;
        }

        stakeholderType[_to] = 2;

        emit Transfer(_from, _to, _amount);

        _afterBondTransfer(_from, _to, _amount, _data);
    }

    function _spendApproval(address _from, address _spender, uint256 _amount) internal virtual {
        uint256 currentApproval = _approvals[_from][_spender];
        require(_amount <= currentApproval, "ERC7092: INSUFFICIENT_ALLOWANCE");

        unchecked {
            _approvals[_from][_spender] = currentApproval - _amount;
        }
   }

    function _beforeBondTransfer(address _from, address _to, uint256 _amount, bytes calldata _data) internal virtual {}

    function _afterBondTransfer(address _from, address _to, uint256 _amount, bytes calldata _data) internal virtual {}
}