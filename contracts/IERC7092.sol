// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

/**
* @title ERC-7092 Financial Bonds tandard
*/
interface IERC7092 {
    /**
    *  @notice Returns the bond isin
    */
    function isin() external view returns(string memory);

    /**
    * @notice Returns the bond name
    */
    function name() external view returns(string memory);

    /**
    * @notice Returns the bond symbol
    *         It is RECOMMENDED to represent the symbol as a combination of the issuer issuer's shorter name and the maturity date
    *         Ex: If a company named Green Energy issues bonds that will mature on october 25, 2030, the bond symbol could be `GE30` or `GE2030` or `GE102530`
    */
    function symbol() external view returns(string memory);

    /**
    * @notice Returns the bond currency. This is the contract address of the token used to make payments and return the bond principal
    */
    function currency() external view returns(address);

    /**
    * @notice Returns the bond denomination. This is the minimum amount in which the bonds may be issued. It MUST be expressed in units of the principal currency.
    *         ex: If the denomination is set at 1,000, and the currency is USDC, then the bond denomination is equivalent to 1,000 USDC.
    */
    function denomination() external view returns(uint256);

    /**
    * @notice Returns the issue volume, which represents the total debt amount. It is RECOMMENDED to express the issue volume in terms of the denomination unit.
    */
    function issueVolume() external view returns(uint256);

    /**
    * @notice Returns the bond interest rate. It is RECOMMENDED to express the interest rate in basis points (bps).
    *         1 basis point = 0.01% = 0.0001
    *         ex: if interest rate = 5%, then coupon() => 500 basis points
    */
    function couponRate() external view returns(uint256);

    /**
    * @notice Returns the coupon type
    *         For example, 0 can denote Zero coupon, 1 can denote Fixed Rate, 2 can denote Floating Rate, and so on
    *
    * OPTIONAL - interfaces and other contracts MUST NOT expect these values to be present. The method is used to improve usability.
    */
    function couponType() external view returns(uint8);

    /**
    * @notice Returns the coupon frequency, i.e. the number of times coupons are paid in a year.
    *
    * OPTIONAL - interfaces and other contracts MUST NOT expect these values to be present. The method is used to improve usability.
    */
    function couponFrequency() external view returns(uint256);

    /**
    * @notice Returns the day count basis
    *         For example, 0 can denote actual/actual, 1 can denote actual/360, and so on
    *
    * OPTIONAL - interfaces and other contracts MUST NOT expect these values to be present. The method is used to improve usability.
    */
    function dayCountBasis() external view returns(uint8);

    /**
    * @notice Returns the date when bonds were issued to investors. This is a Unix Timestamp similar the one returned by block.timestamp
    */
    function issueDate() external view returns(uint256);

    /**
    * @notice Returns the bond maturity date, i.e, the date when the principal is repaid. This is a Unix Timestamp similar the one returned by block.timestamp
    *         The maturity date MUST be greater than the issue date
    */
    function maturityDate() external view returns(uint256);

    /**
    * @notice Returns the principal of an account. It is RECOMMENDED to express the principal in the bond currency unit (e.g., USDC, DAI, etc)
    * @param _account account address
    */
    function principalOf(address _account) external view returns(uint256);

    /**
    * @notice Returns the number of tokens that the `_spender` account has been authorized by the `_owner` to manage
    * @param _owner the bondholder address
    * @param _spender the address that has been authorized by the bondholder
    */
    function allowance(address _owner, address _spender) external view returns(uint256);

    /**
    * @notice Authorizes `_spender` account to manage  a specified `_amount`of the bondholder's tokens
    * @param _spender the account to be authorized by the bondholder
    * @param _amount amount of bond tokens to approve
    */
    function approve(address _spender, uint256 _amount) external returns(bool);

    /**
    * @notice Decreases the allowance granted to `_spender` by `_amount`
    * @param _spender the address to be authorized by the bondholder
    * @param _amount amount of bond tokens to remove from allowance
    */
    function decreaseAllowance(address _spender, uint256 _amount) external returns(bool);

    /**
    * @notice Transfers `_amount` bonds to the address `_to`. Additionally, this method enables to attach data to the token being transferred
    * @param _to the address to send bonds to
    * @param _amount amount of bond tokens to transfer
    * @param _data additional information provided by the token holder
    */
    function transfer(address _to, uint256 _amount, bytes calldata _data) external returns(bool);

    /**
    * @notice Transfers `_amount` bonds from an account that has previously authorized the caller through the `approve` function
    *         This methods also allows to attach data to the token that is being transferred
    * @param _from the bondholder address
    * @param _to the address to transfer bonds to
    * @param _amount amount of bond tokens to transfer.
    * @param _data additional information provided by the token holder
    */
    function transferFrom(address _from, address _to, uint256 _amount, bytes calldata _data) external returns(bool);

    /**
    * @notice MUST be emitted when bond tokens are transferred, issued or redeemed, with the exception being during contract creation
    * @param _from bondholder account
    * @param _to account to transfer bonds to
    * @param _amount amount of bond tokens to be transferred
    */
    event Transfer(address _from, address _to, uint256 _amount);

    /**
    * @notice MUST be emitted when an account is approved to spend tokens or when the allowance is decreased
    * @param _owner bondholder account
    * @param _spender the account to be allowed to spend bonds
    * @param _amount amount of bond tokens allowed by _owner to be spent by `_spender`
    *        Or amount of bond tokens to decrease allowance from `_spender`
    */
    event Approval(address _owner, address _spender, uint256 _amount);
}