const AllocateTokens=artifacts.require("AllocateTokens");

module.exports = function (deployer) {
    deployer.deploy(AllocateTokens);
};
