// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract MintTokens {
    string public name = "Carbon Token";
    address public owner;
    uint256 public totalSupply;

    mapping(address => uint256) public balances;

    // Modifier to restrict access to only the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Mint tokens with ether
    function mint(uint256 amount) public payable {
        require(msg.value >= amount * 0.01 ether, "Insufficient Ether sent");
        totalSupply += amount;
        balances[msg.sender] += amount;
    }

    // Withdraw function to allow the owner to withdraw ether
    function withdraw(uint256 amount) public onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner).transfer(amount);
    }

    // Get the balance of an address
    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }
}
