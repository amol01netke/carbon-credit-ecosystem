// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BuyCredits {
    // Define state variables
    address public generator; // Address of the token generator
    uint256 public tokenPrice; // Price of 1 token in wei
    mapping(address => uint256) public balances; // Balances of tokens for each consumer

    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 totalCost);

    // Constructor to initialize generator and token price
    constructor(uint256 _tokenPrice) {
        generator = msg.sender; // Set the generator as the contract deployer
        tokenPrice = _tokenPrice; // Set the price of each token
    }

    // Modifier to restrict access to the generator
    modifier onlyGenerator() {
        require(msg.sender == generator, "Only generator can perform this action");
        _;
    }

    // Mint new tokens (can only be called by the generator)
    function mintTokens(address to, uint256 amount) public onlyGenerator {
        balances[to] += amount; // Increase token balance of the recipient
        emit TokensMinted(to, amount); // Emit the minting event
    }

    // Purchase tokens (called by consumers)
    function buyTokens() public payable {
        require(msg.value > 0, "Send ETH to purchase tokens");

        uint256 tokensToBuy = msg.value / tokenPrice; // Calculate the number of tokens to be purchased
        require(tokensToBuy > 0, "Insufficient ETH to buy tokens");

        balances[msg.sender] += tokensToBuy; // Add tokens to buyer's balance
        emit TokensPurchased(msg.sender, tokensToBuy, msg.value); // Emit the purchase event
    }

    // Withdraw collected ETH (can only be called by the generator)
    function withdraw() public onlyGenerator {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH available to withdraw");

        payable(generator).transfer(balance); // Transfer ETH to the generator
    }

    // Get the token balance of a specific address
    function getTokenBalance(address account) public view returns (uint256) {
        return balances[account];
    }
}
