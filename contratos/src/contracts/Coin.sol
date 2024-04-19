//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import '../interfaces/IERC20.sol';

contract Coin is IERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    uint256 public price;
    address public systemContract;

    mapping (address => uint256) internal balanceOf;
    mapping (address => mapping (address => uint256)) internal allowance;


    constructor(string memory _name, string memory _symbol, address _systemContract) {
        require( keccak256(bytes(name)) != keccak256(bytes("")), "Invalid _name" );
        require(_systemContract != address(0), 'Invalid _systemContract');
        name = _name;
        symbol = _symbol;
        decimals = 18;
        systemContract = _systemContract;
    }

}