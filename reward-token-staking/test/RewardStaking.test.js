const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RewardTokenStaking", () => {
  let token, staking, deployer, user1;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("RewardToken");
    const Staking = await ethers.getContractFactory("RewardTokenStaking");

    token = await Token.deploy(10000);
    staking = await Staking.deploy(token.address);
    [deployer, user1] = await ethers.getSigners();
  });

  context("When staking the reward tokens which I have", () => {
    let amount, owner, spender;
    beforeEach(() => {
      amount = "1000";
      owner = user1;
      spender = staking;
    });

    it("Allows staking", async () => {
      await expect(
        token.connect(deployer).reward(owner.address, amount)
      ).to.not.be.revertedWith("NotEnoughTokens");
      expect(await token.balanceOf(owner.address)).to.equal(amount);

      // user approves staking contract as a spender for amount
      await expect(
        token.connect(owner).approve(spender.address, amount)
      ).to.emit(token, "Approval");

      // user gets the allowance on the staking contract
      const allowance = await token
        .connect(owner)
        .allowance(owner.address, spender.address);
      expect(allowance.toString()).to.equal(amount.toString());

      // staking contract transfers from token spender (contract)
      await expect(staking.connect(owner).stake(amount)).to.not.be.reverted;
    });
  });
});
