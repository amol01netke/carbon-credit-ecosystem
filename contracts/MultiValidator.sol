// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IMintContract{
    function mintTokens(address generator, uint256 amount) external;
    function burnFrom(address consumer,uint256 amount) external;
}

interface IMintNFT{
    function mintCRC(address consumer, uint256 amount) external;
}

contract MultiValidator {
    address public validator; // Validator
    address payable public receiver; // Generator   
    address public mint;  //mint
    uint256 public creditAmount; // Hold credits
    uint256 public approvalCount=0; // Approvals
    
    //consumer part
    uint256 public approveNFT=0; 
    address payable public consumer_receiver;
    uint256 public retireAmount;
    address public nftContract;

    uint256 constant CCT_DECIMALS = 10**18; // Scaling factor

    constructor(address _validator, address _mint, address _nftContract) payable {
        require(_validator != address(0), "Validator address cannot be zero");
        validator = _validator;
        mint=_mint;
        nftContract=_nftContract;
    }

    function burnTokens(address payable _consumer,uint256 _amount) public {
        approveNFT++;

        if(approveNFT==1){
            consumer_receiver=_consumer;
            retireAmount=_amount;
        }
        else if (approveNFT==2){
            uint256 scaledAmount = retireAmount * CCT_DECIMALS;
            IMintContract(mint).burnFrom(_consumer, scaledAmount);

            //NFT MINT OVER HERE
            IMintNFT(nftContract).mintCRC(_consumer, scaledAmount);

            //reset
            approveNFT=0;
            retireAmount=0;
        }
    }

    function voteToApprove(address payable _generator, uint256 _sequestrationTons) public{
        approvalCount++;

        if(approvalCount==1){
            receiver = _generator;
            creditAmount = _sequestrationTons  * 1 ether; // store first credit
        }
        else if(approvalCount==2){
            // require(address(this).balance >= creditAmount, "Insufficient contract balance");
            // receiver.transfer(creditAmount); 

            IMintContract(mint).mintTokens(_generator, creditAmount);
            approvalCount = 0; // Reset the count
            creditAmount = 0; // Reset the credit
        }
    }
    
    receive() external payable {}
    fallback() external payable {}
}
