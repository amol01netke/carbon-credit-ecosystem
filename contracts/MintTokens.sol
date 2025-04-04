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

    function transferFrom(address _sender, address _receiver, uint256 _amount) external{
        require(balanceOf[_sender] >= _amount, "Not enough CCT tokens");
        
        balanceOf[_sender]-=_amount;
        balanceOf[_receiver]+=_amount;
    }

    function burnFrom(address _from, uint256 _amount) external{
        require(balanceOf[_from]>=_amount,"Insufficient CCT in consumer's wallet");
        balanceOf[_from]-=_amount;
        totalSupply-=_amount;
    }
}
