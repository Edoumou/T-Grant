// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

interface IData {
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
        uint8 dayCountBasis;
        uint256 issueDate;
        uint256 maturityDate;
    }

    struct Issuer {
        address accountAddress;
        string name;
        string country;
        string email;
        string category;
        string creditRating;
        uint256 carbonCredit;
        string logoURI;
    }

    struct Offer {
        address investor;
        uint256 principal;
    }

    struct CouponPaymentReceipt {
        string issuerName;
        uint256 issueVolume;
        uint256 couponRate;
        uint256 interestPaid;
    }
}