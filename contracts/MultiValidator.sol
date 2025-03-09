// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MultiValidator {
    address public owner; //validator
    address payable public receiver ; //generator    
    uint256 public creditAmount; //hold credits
    
    constructor(address _validator) {
        owner = _validator; //validator
    }

    function voteToApprove(address payable _generator, uint256 _sequestrationTons) public {
        receiver = _generator; 
        creditAmount = _sequestrationTons;

        //require(address(this).balance >= creditAmount * 0.1 ether, "Insufficient contract balance");
        receiver.transfer(creditAmount); // Send ETH based on sequestration
    }

    receive() external payable {}
}
