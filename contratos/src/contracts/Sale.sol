//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import '../interfaces/ISale.sol';
import '../interfaces/ISystem.sol';
import '../interfaces/IItem.sol';
import '../interfaces/ICoin.sol';

contract Sale is ISale {
    
    mapping(uint256 token => uint256[] offers) internal activeItemOffers;
    mapping(address user => uint256[] offers) public userSentOffers;
    mapping(address user => uint256[] offers) public userReceivedOffers;
    uint256 internal nextOffer;
    mapping(uint256 => SaleMetadata) public offerMetadata;

    ISystem internal system;

    constructor(address _systemContract){
        system = ISystem(_systemContract);
        nextOffer = 1;
    }

    
}