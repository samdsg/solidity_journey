pragma solidity ^0.5.0;

contract DappToken {
    string public name = "DApp Token";
    string public symbol = "DAPP";
    uint256 public totalSupply = 1000000;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    // allowance

    event Transfer(address indexed _from, address indexed _to, uint256 amount);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value);

        emit Transfer(msg.sender, _to, _value);
        // Transfer Event

        return true;
    }

    // Delegated Transfers

    // approve
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        // Approve event
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    // transferFrom
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        // Require _from has enough tokens
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        // Require allowance is big enough

        //Change th balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        // Update the allowance
        allowance[_from][msg.sender] -= _value;
        
        // Transfer Event
        Transfer(_from, _to, _value);
        return true;
    }
}
