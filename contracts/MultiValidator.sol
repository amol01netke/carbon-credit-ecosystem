// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MultiValidator {
    address public owner; // Validator
    address payable public receiver; // Generator    
    uint256 public creditAmount; // Hold credits

    constructor(address _validator) payable {
        require(_validator != address(0), "Validator address cannot be zero");
        owner = _validator;
    }

    function voteToApprove(address payable _generator, uint256 _sequestrationTons) public {
        receiver = _generator;
        creditAmount = _sequestrationTons;

        require(address(this).balance >= creditAmount * 1 ether, "Insufficient contract balance");
        receiver.transfer(creditAmount * 1 ether); // Send ETH based on sequestration
    }
    
    receive() external payable {}
    fallback() external payable {}
}
