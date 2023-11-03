// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./IERC7092.sol";
import "./BondStorage.sol";

contract BondTopos is IERC7092, BondStorage {
    constructor(
        string memory _dealID,
        address _bondManager,
        address _issuerWalletAddress,
        string memory _countryOfIssuance,
        address _bondCallContractAddress,
        address _identiRegistryContract
    ) {
        dealID = _dealID;
        bondManager = _bondManager;
        issueData[_dealID].issuerWalletAddress = _issuerWalletAddress;
        issueData[_dealID].countryOfIssuance = _countryOfIssuance;
        issueData[_dealID].bondCallContract = _bondCallContractAddress;
        issueData[_dealID].identyRegistryContract = _identiRegistryContract;
    }

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

    function totalSupply() external view returns(uint256) {
        return bonds[dealID].issueVolume / bonds[dealID].denomination;
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
        return principals[_account];
    }

    function balanceOf(address _account) external view returns(uint256) {
        return principals[_account] / bonds[dealID].denomination;
    }

    function allowance(address _owner, address _spender) external view returns(uint256) {
        return approvals[_owner][_spender];
    }

    function approve(
        address _spender,
        uint256 _amount
    ) external mustBeApproved(_spender) returns(bool) {
        address _owner = tx.origin;

        _approve(_owner, _spender, _amount);

        return true;
    }

    function decreaseAllowance(
        address _spender,
        uint256 _amount
    ) external {
        address _owner = tx.origin;

        _decreaseAllowance(_owner, _spender, _amount);
    }

    function transfer(
        address _to,
        uint256 _amount,
        bytes calldata _data
    ) external mustBeApproved(_to) returns(bool) {
        address _from = tx.origin;

        _transfer(_from, _to, _amount, _data);

        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount,
        bytes calldata _data
    ) external mustBeApproved(_to) returns(bool) {
        address _spender = tx.origin;

        _spendAllowance(_from, _spender, _amount);
        _transfer(_from, _to, _amount, _data);

        return true;
    }

    function _approve(
        address _owner,
        address _spender,
        uint256 _amount
    ) internal virtual {
        require(_owner != address(0), "INVALID_ADDRESS");
        require(_spender != address(0), "INVALID_SPENDER_ADDRESS");
        require(_amount > 0, "INVALID_AMOUNT");

        uint256 principal = principals[_owner];
        uint256 approval = approvals[_owner][_spender];
        uint256 _denomination = bonds[dealID].denomination;
        uint256 _maturityDate = bonds[dealID].maturityDate;
        uint256 balance = principal / _denomination;

        require(block.timestamp < _maturityDate, "BONDS_MATURED");
        require(_amount <= balance, "INSUFFICIENT_BALANCE");
        require((_amount * _denomination) % _denomination == 0, "INVALID_AMOUNT");

        approvals[_owner][_spender] = approval + _amount;

        emit Approval(_owner, _spender, _amount);
    }

    function _decreaseAllowance(
        address _owner,
        address _spender,
        uint256 _amount
    ) internal virtual {
        require(_owner != address(0), "INVALID_ADDRESS");
        require(_spender != address(0), "INVALID_SPENDER_ADDRESS");
        require(_amount > 0, "INVALID_AMOUNT");

        uint256 approval = approvals[_owner][_spender];
        uint256 _denomination = bonds[dealID].denomination;
        uint256 _maturityDate = bonds[dealID].maturityDate;

        require(block.timestamp < _maturityDate, "BONDS_MATURED");
        require(_amount <= approval, "INSUFFICIENT_ALLOWANCE");
        require((_amount * _denomination) % _denomination == 0, "INVALID_AMOUNT");

        approvals[_owner][_spender] = approval - _amount;

        emit Approval(_owner, _spender, _amount);
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _amount,
        bytes calldata _data
    ) internal virtual {
        require(_from != address(0), "INVALID_ADDRESS");
        require(_to != address(0), "INVALID_RECIPIENT_ADDRESS");
        require(_amount > 0, "INVALID_AMOUNT");

        uint256 principal = principals[_from];
        uint256 _denomination = bonds[dealID].denomination;
        uint256 _maturityDate = bonds[dealID].maturityDate;
        uint256 balance = principal / _denomination;

        require(block.timestamp < _maturityDate, "BONDS_MATURED");
        require(_amount <= balance, "INSUFFICIENT_BALANCE");
        require((_amount * _denomination) % _denomination == 0, "INVALID_AMOUNT");

        _beforeBondTransfer(_from, _to, _amount, _data);

        uint256 principalTo = principals[_to];
        unchecked {
            uint256 principalToTransfer = principal * _denomination;

            principals[_from] = principal - principalToTransfer;
            principals[_to] = principalTo + principalToTransfer;
        }

        _afterBondTransfer(_from, _to, _amount, _data);

        emit Transfer(_from, _to, _amount);
    }

    function _spendAllowance(
        address _from,
        address _spender,
        uint256 _amount
    ) internal virtual {
        uint256 currentApproval = approvals[_from][_spender];
        require(_amount <= currentApproval, "INSUFFICIENT_ALLOWANCE");

        unchecked {
            approvals[_from][_spender] = currentApproval - _amount;
        }
    }

    function _beforeBondTransfer(address _from, address _to, uint256 _amount, bytes calldata _data) internal virtual {}

    function _afterBondTransfer(address _from, address _to, uint256 _amount, bytes calldata _data) internal virtual {}
}