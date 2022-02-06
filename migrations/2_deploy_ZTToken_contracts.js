require('dotenv').config({path: '../.env'})

var ZTToken = artifacts.require('./ZTToken.sol')
var ZTTokenSale = artifacts.require('./ZTTokenSale.sol')
var KYC = artifacts.require('./KYC.sol')

module.exports = async function(deployer) {
    let accounts = await web3.eth.getAccounts()
    await deployer.deploy(ZTToken, process.env.INITIAL_TOKENS)
    await deployer.deploy(KYC)
    await deployer.deploy(ZTTokenSale, process.env.SALE_RATE, accounts[0], ZTToken.address, KYC.address)
    let tokenInstance = await ZTToken.deployed()
    await tokenInstance.transfer(ZTTokenSale.address, process.env.NUMBER_OF_TOKENS_FOR_SALE)
}