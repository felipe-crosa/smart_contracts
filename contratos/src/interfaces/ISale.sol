pragma solidity 0.8.19;

interface ISale {
    enum Status { ACCEPTED, REJECTED, WAITING, CANCELED}

    struct SaleMetadata {
        address offeringAddress;
        uint256 wantedTokenId;
        uint256 amount;
        Status status;
    }

    function publishOffer(uint256 _wantedTokenId, uint256 _amount) external returns (uint256 _offerId);
    function rejectOffer(uint256 _offerId) external;
    function acceptOffer(uint256 _offerId) external;
    function cancelOffer(uint256 _offerId) external;
    function userSentOffers(address _user) view external returns (uint256[] memory);
    function userReceivedOffers(address _user) view external returns (uint256[] memory);
}
    