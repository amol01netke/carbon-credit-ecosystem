// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IMintContract {
    function transferFrom(address from, address to, uint256 amount) external;
    function burnFrom(address from, uint256 amount) external;
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

    address public consumer;

    constructor(address _consumer,address _mintContract) payable{
        require(_consumer != address(0), "Validator address cannot be zero");
        consumer = _consumer;
        mintContract = IMintContract(_mintContract);
    }

    function listTokens(uint256 _amount, uint256 _price) external {
        uint256 scaledAmount = _amount * CCT_DECIMALS; // Convert to full units
        uint256 scaledPrice = _price * 1 ether;

        mintContract.transferFrom(msg.sender, address(this), scaledAmount);

        // Check if seller already has a listing
        // bool updated = false;
        // for (uint256 i = 0; i < listings.length; i++) {
        //     if (listings[i].seller == msg.sender) {
        //         listings[i].amount += scaledAmount;
        //         listings[i].pricePerCCT = scaledPrice;
        //         updated = true;
        //         break;
        //     }
        // }

        //if(!updated){
            listings.push(Listing({
                seller: msg.sender,
                amount: scaledAmount,
                pricePerCCT: scaledPrice
            }));
        //}
    }

    function fetchListings() external view returns (Listing[] memory){
        return listings;
    }

    function buyTokens(uint256 index, uint256 _amount) external payable{
        uint256 scaledBuyAmount=_amount*CCT_DECIMALS;

        //find the listing //issue part
        // uint256 listingIdx=type(uint256).max;
        // for(uint256 i=0;i<listings.length;i++){
        //     if(listings[i].seller== _gen){
        //         listingIdx=i;
        //         break;
        //     }
        // }

        //check if the seller has enough cct
        Listing storage listing = listings[index];
        //require(listing.amount>=scaledBuyAmount,"Seller does not have enough CCT");
        
        //transfer cct
        mintContract.transferFrom(address(this),msg.sender,scaledBuyAmount);
        listing.amount-=scaledBuyAmount;

        //send eth
        uint256 totalETH=(scaledBuyAmount * listing.pricePerCCT)/CCT_DECIMALS;
        payable(listing.seller).transfer(totalETH);
    }
}