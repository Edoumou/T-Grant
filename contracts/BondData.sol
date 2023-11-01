// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

abstract contract BondData {
    struct Bond {
        string isin;
        string name;
        string symbol;
        address currency;
        uint256 denomination;
        uint256 issueVolume;
        uint256 couponRate;
        uint8 couponType;
        uint256 couponFrequency;
        uint256 issueDate;
        uint256 maturityDate;
    }

    struct Deal {
        string dealID;
        string prospectusURI;
        string issuerAddress;
        uint256 debtAmount;
        uint256 couponRate;
        uint256 couponFrequency;
        uint256 maturityDate;
        address currency;
        uint8 couponType;
        uint8 status;
    }

    struct Issuer {
        string documentURI;
        string name;
        string country;
        string issuerType;
        string creditRating;
        uint256 carbonCredit;
        address walletAddress;
    }

    struct Investor {
        string name;
        string country;
        string investorType;
        address walletAddress;
    }

    struct IssueData {
        address issuerWalletAddress;
        string countryOfIssuance;
        address bondCallContract;
        address identiRegistryContract;
    }

    struct Investment {
        address investor;
        uint256 amount;
    }

    enum BondStatus {UNREGISTERED, SUBMITTED, ISSUED, REDEEMED}
    enum DealStatus {SUBMITTED, APPROVED, REJECTED, ISSUED, REDEEMED}
    enum StakeHolderStatus {UNKNOWN, SUBMITTED, APPROVED, REJECTED}
}