var DappToken = artifacts.require("DappToken");

// contract("DappToken", function (accounts) {
//   var tokenInstance;
//   it("initializes the contract with the correct values", function () {
//     return DappToken.deployed()
//       .then(function (instance) {
//         tokenInstance = instance;
//       })
//       .then(function (name) {
//         assert.equal("DApp Token", "has the correct name");
//         return tokenInstance.symbol();
//       })
//       .then(function (symbol) {
//         assert.equal(symbol, "DAPP", "hass the correct symbol");
//       });
//   });

//   it("sets the total supply upon development", function () {
//     return DappToken.deployed()
//       .then(function (instance) {
//         tokenInstance = instance;
//         return tokenInstance.totalSupply();
//       })
//       .then(function (totalSupply) {
//         assert.equal(
//           totalSupply.toNumber(),
//           100000,
//           "sets the total supply to 1,000,000"
//         );
//         return tokenInstance.balanceOf(accounts[0]);
//       })
//       .then(function (adminBalance) {
//         assert.equal(
//           adminBalance.toNumber(),
//           100000,
//           "it allocates the initial supply"
//         );
//       });
//   });
// });

it("transfers token ownership", function () {
  return DappToken.deployed()
    .then(function (instance) {
      tokenInstance = instance;

      return tokenInstance.transfers.call(accounts[1], 999999999);
    })
    .then(assert.fail)
    .catch(function (error) {
      assert(
        error.message.indexOf("revert") >= 0,
        "error message must contain revert"
      );

      return tokenInstance.transfer(accounts[1], 25, { from: accounts[0] });
    })
    .then(function (receipt) {
      return tokenInstance.balanceOf(accounts[1]);
    })
    .then(function (balance) {
      assert.equal(
        balance.toNumber(),
        250000,
        "adds the amount to the receiving account"
      );
      return tokenInstance.balanceOf(accounts[0]);
    })
    .then(function (balance) {
      assert.equal(
        balance.toNumber(),
        750000,
        "deducts the amount from the sending account"
      );

      balanceOf[msg.sender] -= _value;
      balanceOf[_to] += _value;
    });
});
