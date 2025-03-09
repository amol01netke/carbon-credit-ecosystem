const MultiValidator=artifacts.require("MultiValidator");

module.exports = function (deployer,network, accounts) {
    console.log("Deploying with accounts:", accounts); // Log available accounts
    deployer.deploy(MultiValidator, accounts[1]);
};