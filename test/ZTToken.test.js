const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

require('dotenv').config({path: '../.env'});

const ZTToken = artifacts.require("ZTToken")

contract('ZTToken', async (accounts) => { 

    const [ initialHolder, recipient, anotherAccount ] = accounts

    const name = 'ZanT Token'
    const symbol = 'ZTT'

    const initialSupply = new BN(process.env.INITIAL_TOKENS)

    beforeEach(async () => {
        this.token = await ZTToken.new(initialSupply)
    })

    describe('initial token', async () => {
        it('has a name', async () => {
            expect(await this.token.name()).to.equal(name)
        })
    
        it('has a symbol', async () => {
            expect(await this.token.symbol()).to.equal(symbol)
        })
        
        it('has 2 decimals', async () => {
            expect(await this.token.decimals()).to.be.bignumber.equal('0')
        })
    })

    describe('total supply', async () => {
        it('returns the total amount of tokens', async () => {
            expect(await this.token.totalSupply()).to.be.bignumber.equal(initialSupply)
        })
    })

    describe('balance of', async () => {
        it('account has no tokens', async () => {
            expect(await this.token.balanceOf(anotherAccount)).to.be.bignumber.equal('0')
        })

        it('account has some tokens', async () => {
            expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(initialSupply)
        })
    })

    describe('transfer', async () => {
        describe('when the sender does not have enough balance', async () => {
            const amount = initialSupply.add(new BN(1))
            it('reverts', async () => {
                await expectRevert(this.token.transfer(recipient, amount), 'transfer amount exceeds balance')
            })
        })

        describe('when the sender transfers all balance', async () => {
            it('the owner transfer all tokens to Account 1, Account 1 transferFrom some tokens to Account 2', async () => {
                await this.token.transfer(recipient, initialSupply)
                expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal('0')

                const amountTransfer = new BN(50)
                await this.token.approve(initialHolder, amountTransfer, { from: recipient })
                await this.token.transferFrom(recipient, anotherAccount, amountTransfer, { from: initialHolder })
                expect(await this.token.allowance(recipient, initialHolder)).to.be.bignumber.equal('0')
                expect(await this.token.balanceOf(recipient)).to.be.bignumber.equal(initialSupply.sub(amountTransfer))
                expect(await this.token.balanceOf(anotherAccount)).to.be.bignumber.equal(amountTransfer)
            })
        })
    })
})