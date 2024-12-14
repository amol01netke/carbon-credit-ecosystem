const MintTokens = artifacts.require("MintTokens");

module.exports = function (deployer) {
  deployer.deploy(MintTokens);
};
