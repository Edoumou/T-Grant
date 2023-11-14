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
        address issuerAddress;
        uint256 debtAmount;
        uint256 couponRate;
        uint256 couponFrequency;
        uint256 maturityDate;
        uint256 index;
        address currency;
        uint8 couponType;
        DealStatus status;
    }

    struct Issuer {
        string documentURI;
        string name;
        string country;
        string issuerType;
        string creditRating;
        uint256 carbonCredit;
        address walletAddress;
        StakeHolderStatus status;
        uint256 index;
    }

    struct Investor {
        string name;
        string country;
        string investorType;
        address walletAddress;
        StakeHolderStatus status;
        uint256 index;
    }

    struct IssueData {
        address issuerWalletAddress;
        string countryOfIssuance;
    }

    struct Investment {
        uint256 amount;
        bool hasInvested;
        uint256 index;
    }

    struct DealInvestment {
        address investor;
        uint256 amount;
    }

    error InvalidInvestorAddress(address investor);
    error InvalidDealStatus(string dealID);

    enum BondStatus {ISSUED, REDEEMED}
    enum DealStatus {UNDEFINED, SUBMITTED, APPROVED, REJECTED, ISSUED, REDEEMED}
    enum StakeHolderStatus {UNDEFINED, SUBMITTED, APPROVED, REJECTED}
}