// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MintTokens {
    string public name = "Carbon Credit Token";
    string public symbol = "CCT";
    uint8 public decimals = 18;

    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;

    function mintTokens(address _generator, uint256 _amount) external {
        balanceOf[_generator] += _amount;
        totalSupply += _amount;
    }
}
