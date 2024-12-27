const MintTokens = artifacts.require("MintTokens");
const BuyCredits=this.artifacts.require("BuyCredits");
const tokenPrice = web3.utils.toWei('0.1', 'ether');
module.exports = function (deployer) {
  deployer.deploy(MintTokens);
  deployer.deploy(BuyCredits,tokenPrice);
};
