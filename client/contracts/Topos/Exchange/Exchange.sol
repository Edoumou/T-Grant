// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./ExchangeStorage.sol";

contract Exchange is ExchangeStorage {
    constructor(
        address _bankContract,
        address _bondCallContract
    ) {
        bankContract = _bankContract;
        bondCallContract = _bondCallContract;
    }

    function listBonds(BondData.Listing memory _listing) external {
        uint256 allowance = BondCall(bondCallContract).allowance(msg.sender, address(this), bondCallContract);

        require(_listing.amount <= allowance, "insufficient allowance");
        require(_listing.owner == msg.sender, "invalid address");

        _listing.index = dealListed.length;

        investorListing[msg.sender][_listing.dealID] = _listing;
        dealListed.push(_listing);

        BondCall(bondCallContract).transfer(address(this), _listing.amount, bytes('0x0'), bondCallContract);
    }

    function cancelListing(string memory _dealID) external {
        BondData.Listing memory listing = investorListing[msg.sender][_dealID];

        require(msg.sender == listing.owner, "not owner");
        require(listing.amount > 0, "not found");

        investorListing[msg.sender][_dealID].price = 0;
        investorListing[msg.sender][_dealID].amount = 0;
        dealListed[investorListing[msg.sender][_dealID].index] = investorListing[msg.sender][_dealID];

        BondCall(bondCallContract).transfer(msg.sender, listing.amount, bytes('0x0'), bondCallContract);
    }

    function updateDealPrice(uint256 _newPrice, string memory _dealID) external {
        uint256 amount = investorListing[msg.sender][_dealID].amount;
        uint256 previousPrice = investorListing[msg.sender][_dealID].price;
        uint256 maturityDate = BondCall(bondCallContract).maturityDate(bondCallContract);

        require(amount > 0, "bond not listed");
        require(_newPrice != previousPrice, "same price");
        require(block.timestamp < maturityDate, "Bonds matured");

        investorListing[msg.sender][_dealID].price = _newPrice;
        dealListed[investorListing[msg.sender][_dealID].index] = investorListing[msg.sender][_dealID];
    }

    function getDealsListed() external view returns(BondData.Listing[] memory) {
        return dealListed;
    }
}