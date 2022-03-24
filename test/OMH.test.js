require('dotenv').config();

const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require('hardhat');

describe("Auction Manager Contract", function () {

  let OMHTokenContract;
  
  let deployer
  let user

  beforeEach(async function () {
    OMHTokenContract = await ethers.getContractFactory("OMHToken");

    [ deployer, user ] = await ethers.getSigners();

    OMHTokenContract = await OMHTokenContract.deploy();
  });

  describe("Deployment", function () {
    
    const totalSupply = BigNumber.from(17 * 10 ** 8).mul(BigNumber.from(10).pow(18));

    it("Should deploy", async function () {
      expect(await OMHTokenContract.address.length).to.equal(42);
    });

    it("Should set the right Owner", async function () {
      expect(await OMHTokenContract.owner()).to.equal(deployer.address);
    });

    it("Should set the right Token Name", async function () {
      expect(await OMHTokenContract.name()).to.equal("OMVERITAS");
    });

    it("Should set the right Token Symbol", async function () {
      expect(await OMHTokenContract.symbol()).to.equal("OMH");
    });

    it("Should set the right TotalSupply ", async function () {
      expect(await OMHTokenContract.totalSupply()).to.equal(totalSupply);
    });

    it("Should mint to owner", async function () {
      const balance = await OMHTokenContract.balanceOf(deployer.address);
      expect(balance).to.equal(totalSupply);
    });
  });

  describe("Transfer Ownership", function () {

    it("Should transfer ownership", async function () {
      await OMHTokenContract.connect(deployer).transferOwnership(user.address);
      expect(await OMHTokenContract.owner()).to.equal(user.address);
    });

    it("Only owner can transfer ownership", async function () {
      await expect(OMHTokenContract.connect(user).transferOwnership(user.address)).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe("Transfer Token", function () {

    it("Should burn token when transfer", async function () {
      const amount = BigNumber.from(10000).mul(BigNumber.from(10).pow(18));

      await OMHTokenContract.connect(deployer).transfer(user.address, amount);

      const userBalance = await OMHTokenContract.balanceOf(user.address);
      expect(userBalance).to.equal(amount.mul(98).div(100));    // burn fee is 2%
    });
   });
});
