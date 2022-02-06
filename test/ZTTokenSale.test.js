const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect } = require('chai');

const ZTToken = artifacts.require("ZTToken")
const ZTTokenSale = artifacts.require("ZTTokenSale")
var KYC = artifacts.require('./KYC.sol')

require('dotenv').config({path: '../.env'});

contract('ZTTokenSale', async (accounts) => {

    const [ initialHolder, recipient, anotherAccount ] = accounts

    beforeEach(async () => {
        this.token = await ZTToken.deployed()
        this.tokenSale = await ZTTokenSale.deployed();
        this.kyc = await KYC.deployed()
    })

    describe('initial sale contract', async () => {
        it('transfer tokens to sale contract', async () => {
            const totalSupply = await this.token.totalSupply()
            expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(totalSupply.sub(new BN(process.env.NUMBER_OF_TOKENS_FOR_SALE)))
        })

        it("sale contract has token for sale", async () => {
            expect(await this.token.balanceOf(ZTTokenSale.address)).to.be.bignumber.equal(new BN(process.env.NUMBER_OF_TOKENS_FOR_SALE))
        })
    })

    describe('buy some tokens by simply sending ether to the smart contract', async () => {
        it('buy tokens with 2 wei', async () => {
            // const balanceOfRecipientBeforeBuy = await this.token.balanceOf(recipient)
            await expectRevert(
                this.tokenSale.sendTransaction({ from: recipient, value: web3.utils.toWei('2', 'wei') }),
                'the buyer has not yet kyc'
            )             

            // await this.kyc.setKYCCompleted(recipient)
            // await this.tokenSale.sendTransaction({
            //     from: recipient,
            //     value: web3.utils.toWei('2', 'wei') 
            // })
            // expect(await this.token.balanceOf(recipient)).to.be.bignumber.equal(balanceOfRecipientBeforeBuy.add(new BN(2)))
            // expect(await this.token.balanceOf(ZTTokenSale.address)).to.be.bignumber.equal((new BN(process.env.NUMBER_OF_TOKENS_FOR_SALE)).sub(new BN(2)))

        })
    })
   
})