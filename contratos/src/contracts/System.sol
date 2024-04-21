//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import '../interfaces/ISystem.sol';

contract System is ISystem {
    mapping (address => bool) public isInternalContract;
    mapping (string => address) public contractAddress;
    address private owner;

    constructor() {
        owner = msg.sender;
        isInternalContract[msg.sender] = true;
    }

    function addContract(string memory _name, address _address) public {
        require(msg.sender == owner, "You are not authorized to add new contracts");
        isInternalContract[_address] = true;
        contractAddress[_name] = _address;
    }

}