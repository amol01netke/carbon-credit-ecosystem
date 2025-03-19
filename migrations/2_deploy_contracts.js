const MultiValidator = artifacts.require("MultiValidator");
const MintTokens=artifacts.require("MintTokens");
const AMM=artifacts.require("AMM");

module.exports = async function (deployer, network, accounts) {
    if (!accounts[0]) {
        throw new Error("accounts[0] is undefined. Check your Truffle network configuration.");
    }

    const validatorAddress = accounts[0]; // Validator address
    const initialFunding = web3.utils.toWei("50", "ether"); // 10 ETH for contract

    console.log("Deploying MultiValidator...");
    console.log(`Validator: ${validatorAddress}`);
    console.log(`Initial Funding: ${initialFunding} wei`);

    await deployer.deploy(MintTokens);
    const mintTokensInstance = await MintTokens.deployed();
    const mintTokensAddress = mintTokensInstance.address;

    await deployer.deploy(MultiValidator, validatorAddress, mintTokensAddress, { from: validatorAddress, value: initialFunding });
    await deployer.deploy(AMM,mintTokensAddress);
    console.log("Deployment successful!");
};
