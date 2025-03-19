// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AMM{
    struct Listing{
        uint256 amount;
        uint256 pricePerCCT;
    }

    Listing[] public listings ;

    function listTokens(uint256 _amount, uint256 _price) external {
        listings.push(Listing({
            amount: _amount,
            pricePerCCT: _price
        }));
    }
}