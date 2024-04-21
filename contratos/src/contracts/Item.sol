pragma solidity 0.8.19;

import '../interfaces/IItem.sol';
import '../interfaces/ISystem.sol';
import '../interfaces/ICoin.sol';

contract Item is IItem {
    string public name;
    string public symbol;
    string public tokenURI;
    uint256 public totalSupply;
    uint256 public mintPrice;
    uint256 public currentTokenID;

    mapping(address => uint256) public balanceOf;
    mapping(uint256 => address) public ownerOf;
    mapping(uint256 => address) public allowance;
    mapping(uint256 => ItemMetadata) public _metadataOf;
    mapping(address => mapping (address => bool)) fullApproval;

    ISystem internal system;

    constructor(string memory _name, string memory _symbol, ISystem _systemContract)  {
        require (keccak256(bytes(name)) != keccak256(bytes("")) && keccak256(bytes(symbol)) != keccak256(bytes("")), "_name and _symbol are mandatory parameters");
        require(bytes(symbol).length == 3, "Invalid symbol");
        name = _name;
        symbol = _symbol;
        currentTokenID=1;
        system = _systemContract;
    }

    modifier validAction (uint256 _tokenId) {
        bool isOwner = ownerOf[_tokenId] == msg.sender;
        bool hasAllowance = allowance[_tokenId] == msg.sender;
        bool isInternalContract = system.isInternalContract(msg.sender);

        require(isOwner || hasAllowance || isInternalContract, "Not authorized");
        _;
    }

    modifier isTokenValid(uint256 _tokenId) {
        require(isValidToken(_tokenId), "Invalid _tokenId");
        _;
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) isTokenValid(_tokenId) validAction(_tokenId) public payable {
        require(_to != address(0), "Invalid address");
        require(_from != _to, "_to must be different from _from");

        _transfer(_from, _to, _tokenId);
        _notifyContract(_tokenId, _from, _to);
        emit Transfer(_from, _to, _tokenId);
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory data) public payable {
        revert("This functionality is not available");
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) isTokenValid(_tokenId) validAction(_tokenId)  public payable {
        require(_to != address(0), "Invalid address");
        require(_from != _to, "Invalid recipient, same as remittent");

        _transfer(_from, _to, _tokenId);
        emit Transfer(_from, _to, _tokenId);
    }

    function _transfer(address _from, address _to, uint256 _tokenId) internal isTokenValid(_tokenId) {
        ownerOf[_tokenId] = _to;
        delete allowance[_tokenId];
        balanceOf[_from] -= 1;
        balanceOf[_to] += 1;

        ItemMetadata memory meta = _metadataOf[_tokenId];
        meta.amountOfOwners = meta.amountOfOwners + 1;
        _metadataOf[_tokenId] = meta;
    }

    function setApprovalForAll(address _operator, bool _approved) public {
        fullApproval[msg.sender][_operator] = _approved;
    }

    function getApproved(uint256 _tokenId) public view returns (address) {
        return allowance[_tokenId];
    }

    function isApprovedForAll(address _owner, address _operator) public view returns (bool) {
        return fullApproval[_owner][_operator];
    }

    
    function approve(address _to, uint256 _tokenId) public isTokenValid(_tokenId) validAction(_tokenId) {
        allowance[_tokenId] = _to;
        emit Approval(ownerOf[_tokenId], _to, _tokenId);
    }

    
    function metadataOf(uint256 _tokenId) public view returns (ItemMetadata memory _metadata) {
        return _metadataOf[_tokenId];
    }

    function isValidToken(uint256 _tokenId) public view returns (bool) {
        bool isWithinRange = _tokenId <= totalSupply && _tokenId > 0;
        return isWithinRange;
    }

    function _notifyContract(uint256 _token, address _from, address _to) internal returns (bool) {
        uint256 codeSize = 0;
        address sender = msg.sender;
        assembly { codeSize := extcodesize(sender) }
        if (codeSize > 0) {
            (bool success, bytes memory response) = msg.sender.call(abi.encodeWithSignature("onERC721Received(address,address,uint256,bytes)", _from, _to, _token, bytes("")));
            require(success, "Receiver is not valid");
            bytes4 retval = abi.decode(response, (bytes4));
            require(retval ==bytes4(keccak256("onERC721Received(address,address,uint256,bytes)")),"Receiver is not valid");
        }
    }

    
}

