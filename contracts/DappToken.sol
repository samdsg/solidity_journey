pragma solidity ^0.5.0;

contract DappToken {
    string public name = "DApp Token";
    string public symbol = "DAPP";
    //symbol
    uint256 public totalSupply = 1000000;
    mapping(address => uint256) public balanceOf;

    event Transfer(address indexed _from, address indexed _to, uint256 amount);

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value);

        Transfer(msg.sender, _to, _value);
        // Transfer Event
    }
}
