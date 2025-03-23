// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IMintContract {
    function transferFrom(address from, address to, uint256 amount) external;
}

contract AMM{
    struct Listing{
        address seller;
        uint256 amount;
        uint256 pricePerCCT;
    }

    Listing[] public listings ;
    IMintContract public mintContract;
    uint256 constant CCT_DECIMALS = 10**18; // Scaling factor

    constructor(address _mintContract) {
        mintContract = IMintContract(_mintContract);
    }

    function listTokens(uint256 _amount, uint256 _price) external {
        uint256 scaledAmount = _amount * CCT_DECIMALS; // Convert to full units

        mintContract.transferFrom(msg.sender, address(this), scaledAmount);

        listings.push(Listing({
            seller: msg.sender,
            amount: scaledAmount,
            pricePerCCT: _price
        }));
    }

    function fetchListings() external view returns (Listing[] memory){
        return listings;
    }
}