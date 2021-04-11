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

// it("transfers token ownership", function () {
//   return DappToken.deployed()
//     .then(function (instance) {
//       tokenInstance = instance;

//       return tokenInstance.transfers.call(accounts[1], 999999999);
//     })
//     .then(assert.fail)
//     .catch(function (error) {
//       assert(
//         error.message.indexOf("revert") >= 0,
//         "error message must contain revert"
//       );

//       return tokenInstance.transfer(accounts[1], 25, { from: accounts[0] });
//     })
//     .then(function (receipt) {
//       return tokenInstance.balanceOf(accounts[1]);
//     })
//     .then(function (balance) {
//       assert.equal(
//         balance.toNumber(),
//         250000,
//         "adds the amount to the receiving account"
//       );
//       return tokenInstance.balanceOf(accounts[0]);
//     })
//     .then(function (balance) {
//       assert.equal(
//         balance.toNumber(),
//         750000,
//         "deducts the amount from the sending account"
//       );

//       balanceOf[msg.sender] -= _value;
//       balanceOf[_to] += _value;
//     });
// });

// contract("MyContract", function (accounts) {
//   it("approves tokens from delegated transfer", function () {
//     return DappToken.deployed()
//       .then((instance) => {
//         tokenInstance = instance;
//         return tokenInstance.approve.call(accounts[1], 100);
//       })
//       .then(function (success) {
//         assert.equal(success, true, "it returns true");
//       });
//   });
// });

contract("MyContract", function (accounts) {
  it("approves tokens from delegated transfer", function () {
    return DappToken.deployed()
      .then((instance) => {
        tokenInstance = instance;
        return tokenInstance.approve.call(accounts[1], 100);
      })
      .then(function (success) {
        assert.equal(success, true, "it returns true");
        return tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");

        assert.equal(
          receipt.logs[0].event,
          "Approval",
          "should be the 'Approval' event"
        );

        assert.equal(
          receipt.logs[0].args._owner,
          accounts[0],
          "logs the account the tokens are authorized by"
        );

        assert.equal(
          receipt.logs[0].args._spender,
          accounts[1],
          "logs the account the tokens are authorized to"
        );

        assert.equal(receipt.logs[0]._value, 100, "logs the transfer amount");
        return tokenInstance.allowance(accounts[0], accounts[1]);
      })
      .then(function (allowance) {
        assert.equal(
          allowance.toNumber(),
          100,
          "stores the allowance for delegated transfer"
        );
      });
  });

  it("handles delegate transfer", function () {
    return DappToken.deployed()
      .then(function (instance) {
        tokenInstance = instance;

        fromAccount = accounts[2];
        toAccount = accounts[3];
        spendingAccount = accounts[4];

        // Transfer some tokens to fromAccount
        return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
      })
      .then((receipt) => {
        // Approve spending account to spend 10 tokens from fromAccount
        return tokenInstance
          .approve(spendingAccount, 10, {
            from: fromAccount,
          })
          .then(function (receipt) {
            // Try traffering something larger than the snder's blance
            return tokenInstance.transferFrom(fromAccount, toAccount, 1000);
          })
          .then(assert.fail)
          .catch((error) => {
            assert(
              error.message.indexOf("revert") >= 0,
              "cannot transfer a value lareger than blance"
            );
            return tokenInstance
              .transferFrom(fromAccount, toAccount, 20, {
                from: spendingAccount,
              })
              .then(assert.fail)
              .catch((erorr) => {
                assert(
                  error.message.indexOf("revert") >= 0,
                  "cannot transfer a value lareger than approved amount"
                );

                return tokenInstance
                  .transferFrom(fromAccount, toAccount, 10, {
                    from: spendingAccount,
                  })
                  .then((success) => {
                    assert.equal(success, true);
                  });
              });
          });
      });
  });
});
