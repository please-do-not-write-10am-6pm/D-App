const { expect } = require("chai");
const { ethers } = require("hardhat");
const { it } = require("node:test");

const { getAccount } = require("../scripts/helpers");

describe("NFT contract", function () {
  let NFT;
  let nft;
  let owner;

  beforeEach(async function () {
    owner = await ethers.getSigner();
    NFT = await ethers.getContractFactory("NFT", getAccount());
    nft = await NFT.deploy();
    await nft.deployed();
  });

  it("should assign the total supply of initial Ethers", async function () {
    const ownerBalance = await nft.balanceOf(owner.address);
    const totalSupply = await nft.TOTAL_SUPPLY();
    expect(totalSupply.toString()).to.equal("10000");
    expect(ownerBalance.toString()).to.equal("0");
  });

  it("should return correct balance of token", async function () {
    const initialBalance = await nft.balanceOf(owner.address);
    expect(initialBalance.toString()).to.eql("0");

    await nft.mintTo(owner.address, {
      gasLimit: 500_000,
      value: ethers.utils.parseEther("0.01"),
    });

    const updatedBalance = await nft.balanceOf(owner.address);
    expect(updatedBalance.toString()).to.eql("1");
  });

  it("shoule return values after withdraw a little.", async function () {
    const payee = await nft.withdrawPayments(owner.address);
    expect(payee).to.eql("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  });
});
