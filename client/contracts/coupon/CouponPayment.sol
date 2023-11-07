// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../IERC7092.sol";
import "../tests/tokens/IERC20.sol";
import "../Topos/interfaces/IBondStorage.sol";
import "./CouponMath.sol";

contract CouponPayment {
    address public toposManager;

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

            IERC20(currencyOfCoupon).transfer(investor, interest);
        }
    }

    function payInterest(uint256 _duration, address _bondContract) external onlyToposManager {
        BondData.DealInvestment[] memory investors = IBondStorage(_bondContract).getListOfInvestors();
        address currencyOfCoupon = IERC7092(_bondContract).currency();

        for(uint256 i; i < investors.length; i++) {
            address investor = investors[i].investor;
            uint256 interest = CouponMath.interest(investor, _duration, _bondContract) * 1e18;

            IERC20(currencyOfCoupon).transfer(investor, interest);
        }
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

            uint256 interest = CouponMath.annualInterest(investor, _bondContract) * 1e18;

            total += interest;
        }

        return total;
    }

    function totalInterestToPay(uint256 _duration, address _bondContract) external view returns(uint256) {
        BondData.DealInvestment[] memory investors = IBondStorage(_bondContract).getListOfInvestors();

        uint256 total;

        for(uint256 i; i < investors.length; i++) {
            address investor = investors[i].investor;

            uint256 interest = CouponMath.interest(investor, _duration, _bondContract) * 1e18;

            total += interest;
        }

        return total / 10_000;
    }
}