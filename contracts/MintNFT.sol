// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MintNFT{
    string public name = "Carbon Removal Certificate";
    string public symbol = "CRC";
    
    struct CRCInfo {
        address owner;
        uint256 burnAmount;       // Amount of carbon retired
        uint256 timestamp;    // When it was retired
    }

    mapping(address => CRCInfo) public certificates;

    function mintCRC(address _consumer,uint256 amount) external{
        certificates[_consumer] = CRCInfo({
            owner: _consumer,
            burnAmount: amount,
            timestamp: block.timestamp
        });
    }

    function getCRC(address _user) external view returns (address owner, uint256 amount,uint256 timestamp) {
        CRCInfo memory info = certificates[_user];
        return (info.owner, info.burnAmount, info.timestamp);
    }
}