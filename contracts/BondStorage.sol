// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./utils/IData.sol";

contract BondStorage is IData {
    mapping(string => Bond) internal _bonds;
    mapping(string => Issuer) internal issuer;
    mapping(address => uint256) internal _principals;
    mapping(address => uint256) internal _principalsLocked;
    mapping(address => mapping(address => uint256)) internal _approvals;
    mapping(address => bool) public isRegistered;
    mapping(address => uint8) public stakeholderType;

    event BondIssued(Bond _bond, Offer[] _offers);
    event Redeemed();
    event MessageSent(
        bytes32 indexed messageId,
        uint64 indexed destinationChainSelector,
        address receiver,
        string text,
        address feeToken,
        uint256 fees
    );

    string public bondISIN;
    address public bondManager;
    uint256 public lock;
    uint256 public issued;
    uint256 public redeemed;

    Offer[] internal _investorsOffer;

    modifier onlyBondManager {
        require(msg.sender == bondManager, "ERC7092: NOT_ALLOWED");
        _;
    }

    modifier notLocked {
        require(lock == 1, "REDEEM_IS_LOCKED");
        _;
    }
}