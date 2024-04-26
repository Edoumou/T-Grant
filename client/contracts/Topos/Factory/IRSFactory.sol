// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../IRS/ERC7586.sol";
import "../IRS/IRSTypes.sol";
import "../interfaces/IDeployBond.sol";

contract IRSFactory {
    mapping(address => mapping(address => bool)) public isIRSContract;
    address public toposManager;
    address public toposBankContract;
    uint256 count;

    modifier onlyToposManager {
        require(
            msg.sender == toposManager,
            "not allowed"
        );
        _;
    }

    constructor (address _toposBankContract) {
        toposManager = msg.sender;
        toposBankContract = _toposBankContract;
    }

    function deployIRSContract (
        address _fixedPayerContract,
        address _floatingPayerContract,
        uint8 _numberOfSwaps,
        string memory _irsTokenName,
        string memory _irsTokenSymbol,
        IRSTypes.IRS memory _irs,
        address _toposBankContract
    ) external onlyToposManager {
        require(
            !isIRSContract[_fixedPayerContract][_floatingPayerContract],
            "Deployed"
        );

        ERC7586 irs = new ERC7586{salt: bytes32(abi.encodePacked(
            _fixedPayerContract, _floatingPayerContract
        ))}(
            _fixedPayerContract,
            _floatingPayerContract,
            _numberOfSwaps,
            _irsTokenName,
            _irsTokenSymbol,
            _irs,
            _toposBankContract
        );

        _irs.status = 1;
        _irs.index = uint8(count);
        _irs.irsContract = address(irs);

        IDeployBond(toposBankContract).setIRSContractAddress(
            _fixedPayerContract,
            _floatingPayerContract,
            address(irs),
            _irs
        );
        isIRSContract[_fixedPayerContract][_floatingPayerContract] = true;

        count++;
    }
}