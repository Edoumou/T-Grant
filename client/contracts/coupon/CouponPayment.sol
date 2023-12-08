// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../IERC7092.sol";
import "../tests/tokens/IERC20.sol";
import "../BondData.sol";
import "../Topos/interfaces/IBondStorage.sol";
import "./CouponMath.sol";

contract CouponPayment {
    address public toposManager;
    address public bankContract;

    mapping(address => BondData.CouponPaymentReceipt[]) interestsPaid;

    constructor() {
        toposManager = msg.sender;
    }

    modifier onlyToposManager {
        require(msg.sender == toposManager, "CouponPayment: ONLY_BANK_MANAGER");
        _;
    }

    function payAnnualInterest(address _bondContract) external onlyToposManager {
        BondData.DealInvestment[] memory investors = IBondStorage(_bondContract).getListOfInvestors();
        address currencyOfCoupon = IERC7092(_bondContract).currency();

        for(uint256 i; i < investors.length; i++) {
            address investor = investors[i].investor;
            uint256 interest = CouponMath.annualInterest(investor, _bondContract) * 1e18;

            IERC20(currencyOfCoupon).transfer(investor, interest / 100);
        }
    }

    /**
    * @notice Pays interests to investors  for a given duration
    * @param _duration the period between the last coupon payment and now
    * @param _bondContract the ERC-7092 bond contract address
    */
    function payInterest(
        uint256 _duration,
        address _bondContract
    ) external onlyToposManager {
        BondData.DealInvestment[] memory investors = IBondStorage(_bondContract).getListOfInvestors();
        address currencyOfCoupon = IERC7092(_bondContract).currency();
        uint256 issueVolume = IERC7092(_bondContract).issueVolume();
        uint256 couponRate = IERC7092(_bondContract).couponRate();

        uint256 totalInterest;
        for(uint256 i; i < investors.length; i++) {
            address investor = investors[i].investor;
            uint256 interest = CouponMath.interest(investor, _duration, _bondContract) * 1e14; // 1e18 / (10_000);

            IERC20(currencyOfCoupon).transfer(investor, interest);

            totalInterest += interest;
        }

        BondData.CouponPaymentReceipt memory receipt = BondData.CouponPaymentReceipt({
            issueVolume: issueVolume,
            couponRate: couponRate,
            interestPaid: totalInterest
        });

        interestsPaid[_bondContract].push(receipt);
    }

    /**
    * @notice Pays interests every minute. This is used ONLY for tests, and should be removed in production
    */
    function payInterestEveryMinutes(address _bondContract) external {
        BondData.DealInvestment[] memory investors = IBondStorage(_bondContract).getListOfInvestors();
        uint256 issueVolume = IERC7092(_bondContract).issueVolume();
        uint256 couponRate = IERC7092(_bondContract).couponRate();
        address currencyOfCoupon = IERC7092(_bondContract).currency();

        uint256 totalInterest;
        for(uint256 i; i < investors.length; i++) {
            address investor = investors[i].investor;
            uint256 principal = investors[i].amount;

            uint256 interest = (principal * 1 ether) * couponRate * 120 / (10_000 * 31536000);

            IERC20(currencyOfCoupon).transfer(investor, interest);

            totalInterest += interest;
        }

        BondData.CouponPaymentReceipt memory receipt = BondData.CouponPaymentReceipt({
            issueVolume: issueVolume,
            couponRate: couponRate,
            interestPaid: totalInterest
        });

        interestsPaid[_bondContract].push(receipt);
    }

    function contractBalance(address _bondContract) external view returns(uint256) {
        address currencyOfCoupon = IERC7092(_bondContract).currency();

        return IERC20(currencyOfCoupon).balanceOf(address(this));
    }

    function totalAnnualInterestToPay(address _bondContract) external view returns(uint256) {
        BondData.DealInvestment[] memory investors = IBondStorage(_bondContract).getListOfInvestors();

        uint256 total;

        for(uint256 i; i < investors.length; i++) {
            address investor = investors[i].investor;

            uint256 interest = CouponMath.annualInterest(investor, _bondContract) * 1e18 / (10_000);

            total += interest;
        }

        return total;
    }

    function totalInterestToPay(uint256 _duration, address _bondContract) external view returns(uint256) {
        BondData.DealInvestment[] memory investors = IBondStorage(_bondContract).getListOfInvestors();

        uint256 total;

        for(uint256 i; i < investors.length; i++) {
            address investor = investors[i].investor;

            uint256 interest = CouponMath.interest(investor, _duration, _bondContract);

            total += interest;
        }

        return total * 1e18 / 10_000; 
    }

    function getListOfInterestsPaid(
        address _bondContract
    ) external view returns(BondData.CouponPaymentReceipt[] memory) {
        return interestsPaid[_bondContract];
    }
}