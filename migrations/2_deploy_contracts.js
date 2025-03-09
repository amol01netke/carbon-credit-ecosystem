const MultiValidator = artifacts.require("MultiValidator");

module.exports = async function (deployer, network, accounts) {
    if (!accounts[0]) {
        throw new Error("accounts[0] is undefined. Check your Truffle network configuration.");
    }

    const validatorAddress = accounts[0]; // Validator address
    const initialFunding = web3.utils.toWei("10", "ether"); // 10 ETH for contract

    console.log("Deploying MultiValidator...");
    console.log(`Validator: ${validatorAddress}`);
    console.log(`Initial Funding: ${initialFunding} wei`);

    await deployer.deploy(MultiValidator, validatorAddress, { from: validatorAddress, value: initialFunding });

    console.log("Deployment successful!");
};
