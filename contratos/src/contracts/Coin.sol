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

    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;


    constructor(string memory _name, string memory _symbol, address _systemContract) {
        require( keccak256(bytes(name)) != keccak256(bytes("")), "Invalid _name" );
        require(_systemContract != address(0), 'Invalid _systemContract');
        name = _name;
        symbol = _symbol;
        decimals = 18;
        systemContract = _systemContract;
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0), "_to is an invalid address");
        require(_value > 0, "_value has to be greater than 0");
        require(balanceOf[msg.sender]>= _value, 'Not enough balance');
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    //TODO: Internal contracts should always be able to transferFrom inspite of allowance
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(_from != address(0), "_from is an invalid address");
        require(_to != address(0), "_to is an invalid address");
        require(_value > 0, "_value has to be greater than 0");
        require(balanceOf[_from] >= _value, 'Not enough balance');
        require(msg.sender == _from || allowance[_from][msg.sender] >= _value, 'Insufficient allowance');

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value; 
        if (_from != msg.sender) {
            allowance[_from][msg.sender] -= _value;
        }
        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        require(_spender != address(0), "_spender is an invalid address");
        require(allowance[msg.sender][_spender] == 0 || _value == 0, '_spender already has an allowance. Set to 0 before assigning new value.');
        require(_value <= balanceOf[msg.sender], 'Not enough balance');
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
    }

    function mint(uint256 _amount, address _recipient) external payable  {
        require(msg.value >= _amount * price, 'Insufficient ether');
        require(_amount > 0, 'Invalid _amount');

        totalSupply += _amount;
        balanceOf[_recipient] += _amount;

        if (msg.value > _amount * price) {
          payable(msg.sender).transfer(msg.value - _amount * price);
        }

        emit Transfer(address(0), _recipient, _amount);
    }
    
    //TODO: Add owners only validation
    function setPrice(uint256 _price) public {
        require(_price > 0, '_price has to be greater than 0');
        price = _price;
    }
}