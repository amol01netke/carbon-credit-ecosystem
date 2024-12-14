// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract MintTokens {
    string public name = "Mintable Token";
    address public owner;
    uint256 public totalSupply;
        
    mapping(address => uint256) public balances;

    constructor() {
        owner = msg.sender;
    }

    function mint(uint256 amount) public payable {
        require(msg.value >= amount * 0.01 ether, "Insufficient Ether sent");
        totalSupply += amount;
        balances[msg.sender] += amount;
    }

    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }
}
