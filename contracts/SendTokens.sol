// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SendTokens {
    address public owner;
    mapping(address => uint256) public balances;

    constructor() {
        owner = msg.sender;
        balances[owner] = 1000000; // Mint 1M tokens to the owner
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "This function is restricted to the owner");
        _;
    }

    function sendTokens(address recipient, uint256 amount) public onlyOwner {
        require(recipient != address(0), "Invalid recipient address");
        require(balances[owner] >= amount, "Not enough tokens!");

        balances[owner] -= amount;
        balances[recipient] += amount;
    }

    function getBalance(address account) public view returns (uint256) {
        return balances[account];
    }
}
