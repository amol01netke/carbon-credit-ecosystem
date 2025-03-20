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

    function transferFrom(address _generator, address _amm, uint256 _amount) external{
        require(balanceOf[_generator] >= _amount, "Not enough CCT tokens");
        
        balanceOf[_generator]-=_amount;
        balanceOf[_amm]+=_amount;
    }
}
