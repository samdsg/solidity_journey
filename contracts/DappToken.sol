pragma solidity ^0.5.0;

contract DappToken {
    // Constructor
    // Set the total number of tokens
    // Read teh total number of tokens
    uint256 public totalSupply;

    constructor() public {
        totalSupply = 100000;
    }
}