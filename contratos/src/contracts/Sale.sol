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

    modifier ValidToken (uint256 _tokenId) {
        IItem items = IItem(system.contractAddress("items"));
        require(items.isValidToken(_tokenId));
        _;
    }

    modifier ValidOffer (uint256 _offerId) {
        require(_offerId > 0 && _offerId < nextOffer, "Invalid offer");
        _;
    }

    modifier WaitingOffer (uint256 _offerId) {
        require(offerMetadata[_offerId].status == Status.WAITING, "Offer is invalid. Status should be WAITING");
        _;
    }



    function publishOffer(uint256 _wantedTokenId, uint256 _amount) public ValidToken(_offerId) returns (uint256 _offerId) {
        address tokenOwner = IItem(system.contractAddress("items")).ownerOf(_wantedTokenId);
        require(tokenOwner != msg.sender, "Cannot make offer for a token you own");
        
        ICoin coins = ICoin(system.contractAddress("coins"));
        require(coins.balanceOf(msg.sender) >= _amount, "Insuficient balance");

        coins.transferFrom(msg.sender, address(this), _amount);

        SaleMetadata memory meta = SaleMetadata({offeringAddress: msg.sender, wantedTokenId: _wantedTokenId, amount: _amount, status: Status.WAITING }); 
  
        uint256 offerId = nextOffer;
        offerMetadata[offerId] = meta;
        activeItemOffers[_wantedTokenId].push(offerId);
        userSentOffers[tokenOwner].push(offerId);
        userReceivedOffers[msg.sender].push(offerId);

        nextOffer++;
        return offerId;
    }

    function rejectOffer(uint256 _offerId) ValidOffer(_offerId) WaitingOffer(_offerId) public {
        IItem items = IItem(system.contractAddress("items"));
        SaleMetadata memory sale = offerMetadata[_offerId];
        require(msg.sender == items.ownerOf(sale.wantedTokenId), "Unauthorized");

        SaleMetadata memory meta = offerMetadata[_offerId];
        meta.status = Status.REJECTED;
        offerMetadata[_offerId] = meta;

        ICoin coins = ICoin(system.contractAddress("coins"));
        coins.transfer(meta.offeringAddress, meta.amount);
    }

    
}