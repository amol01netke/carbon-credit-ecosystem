// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MultiValidator {
    address public validator; // Validator
    address payable public receiver; // Generator    
    uint256 public creditAmount; // Hold credits
    uint256 public approvalCount=0; // Approvals

    constructor(address _validator) payable {
        require(_validator != address(0), "Validator address cannot be zero");
        validator = _validator;
    }

    function voteToApprove(address payable _generator, uint256 _sequestrationTons) public{
        approvalCount++;

        if(approvalCount==1){
            receiver = _generator;
            creditAmount = _sequestrationTons  * 1 ether; // store first credit
        }
        else if(approvalCount==2){
            require(address(this).balance >= creditAmount, "Insufficient contract balance");
            receiver.transfer(creditAmount); 
            approvalCount = 0; // Reset the count
            creditAmount = 0; // Reset the credit
        }
    }
    
    receive() external payable {}
    fallback() external payable {}
}
