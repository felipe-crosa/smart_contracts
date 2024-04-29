pragma solidity 0.8.19;

import './IERC20.sol';

interface ICoin is IERC20 {
    function setPrice(uint256 _price) external;
    function mint(uint256 _amount, address _recipient) external payable;
}
    