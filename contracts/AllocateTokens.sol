// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AllocateTokens {
    mapping(string => bool) public verifiedReports;
    mapping(address => uint256) public tokenBalance;
    address public owner;
    uint256 public tokenToEthRate = 0.01 ether; // 1 Token = 0.01 ETH

    event TokensAllocated(address indexed generator, string cid, uint256 tokens, uint256 ethTransferred);

    constructor() {
        owner = msg.sender;
    }

    function approveAndTransferEther(
        string memory cid,
        address payable generator,
        uint256 tokens
    ) public payable {
        // Commented out the "already verified" check
        // require(!verifiedReports[cid], "Report already verified");

        uint256 ethAmount = tokens * tokenToEthRate;
        require(msg.sender.balance >= ethAmount, "Insufficient balance");

        verifiedReports[cid] = true;
        tokenBalance[generator] += tokens;

        // Transfer ETH from Validator to Generator
        generator.transfer(ethAmount);

        emit TokensAllocated(generator, cid, tokens, ethAmount);
    }

    function getBalance(address generator) public view returns (uint256) {
        return tokenBalance[generator];
    }
}
