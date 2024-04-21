pragma solidity 0.8.19;

import './IERC721.sol';

interface ISystem {
    function isInternalContract(address _contract) external  view returns (bool);
    function contractAddress(string memory _name) external view returns (address);
    function addContract(string memory _name, address _address) external;
}
    