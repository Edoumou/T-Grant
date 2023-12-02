// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "../IERC7092.sol";

library CouponMath {
    uint256 constant private NUMBER_OF_SECONDS_IN_YEAR = 31536000;

    /**
    * @notice Returns the annual interest earned by an account in bips
    * @param _investor the investor account address
    * @param _bondContract the bond contract address
    */
    function annualInterest(
        address _investor,
        address _bondContract
    ) external view returns(uint256) {
        uint256 couponRate = IERC7092(_bondContract).couponRate();
        uint256 principal = IERC7092(_bondContract).principalOf(_investor);

        return principal * couponRate;
    }

    /**
    * @notice Returns the interest earned by an account in period `_duration` in bips
    * @param _investor the investor account address
    * @param _duration time ellapsed since the last coupon payment
    * @param _bondContract the bond contract address
    */
    function interest(
        address _investor,
        uint256 _duration,
        address _bondContract
    ) external view returns(uint256) {
        uint256 couponRate = IERC7092(_bondContract).couponRate();
        uint256 principal = IERC7092(_bondContract).principalOf(_investor);
        uint256 frequency = IERC7092(_bondContract).couponFrequency();
        //uint256 numberOfDays = _numberOfDays(_bondContract);

        return principal * couponRate * _duration / (frequency * NUMBER_OF_SECONDS_IN_YEAR);
    }

    /**
    * @notice The day count basis is OPTIONAL for the ERC7092 standard.
    *         To use this function, we need to add the optional `dayCountBasis`function
    *         in the ERC7092 interface
    */
    /*
    function _numberOfDays(address _bondContract) private view returns(uint256) {
        uint256 dayCountBasis = IERC7092(_bondContract).dayCountBasis();

        if(dayCountBasis == 0) {
            return 365;
        } else if(dayCountBasis == 1) {
            return 360;
        } else {
            revert("invalid day count basis value");
        }
    }
    */
}