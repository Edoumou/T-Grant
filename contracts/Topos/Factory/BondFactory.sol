// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../../BondTopos.sol";
import "../interfaces/IDeployBond.sol";

contract BondFactory {
    mapping(string => bool) public isBondContract;

    address public toposManager;
    address public toposBankContract;
    address public bondCallContract;

    modifier onlyToposManager {
        require(
            msg.sender == toposManager,
            "NOT_ALLOWED"
        );
        _;
    }

    constructor(
        address _toposManger,
        address _toposBankContract,
        address _bondCallContract
    ) {
        toposManager = _toposManger;
        toposBankContract = _toposBankContract;
        bondCallContract = _bondCallContract;
    }

    function DeployBondContract(
        string calldata _dealID,
        address _issuerWalletAddress,
        string calldata _countryOfIssuance
    ) external {
        require(!isBondContract[_dealID], "CONTRACT_ALREADY_DEPLOYED");

        BondTopos bond = new BondTopos{salt: bytes32(abi.encodePacked(_dealID))}(
            _dealID,
            _issuerWalletAddress,
            _countryOfIssuance
        );

        IDeployBond(toposBankContract).setBondContractAddress(_dealID, address(bond));
        isBondContract[_dealID] = true;
    }
}