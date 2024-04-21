pragma solidity 0.8.19;

import './IERC721.sol';

interface IItem is IERC721 {
    
    struct ItemMetadata {
        string name;
        address creator;
        string imageURL;
        uint256 amountOfOwners;
    }

    function metadataOf(uint256 tokenId) view external returns (ItemMetadata memory);
    function mint(string memory name, string memory imageUrl) external returns (uint256); 
    function setMintingPrice(uint256 _mintPrice) external;
    function isValidToken(uint256 _token) external returns (bool);

}
    