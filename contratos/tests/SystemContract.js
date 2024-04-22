const { ethers } = require("hardhat");
const { expect } = require("chai");

let _systemContract;
let _user1;
let _user2;
let _user3;

describe("System", async function () {

    beforeEach(async function () {
        const [owner, user2, user3] = await ethers.getSigners();
        _user1 = owner
        _user2 = user2
        _user3 = user3
    });

    describe("Deployment", function () {
        it("Test Deploy", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            await expect(await _systemContract.isInternalContract(_user1.address)).to.be.equal(true)
        });
    });

    describe("Add Internal Contract", function () {
        it("Test Add new Internal Contract Successful", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            await _systemContract.addContract("TEST", _user2.address);
            await expect(await _systemContract.isInternalContract(_user2.address)).to.be.equal(true)
            await expect(await _systemContract.contractAddress("TEST")).to.be.equal(_user2.address)
        });
        it("Only owner can add new contract", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            await expect(_systemContract.connect(_user2).addContract("TEST", _user2.address)).to.be.revertedWith("You are not authorized to add new contracts");
        });
    });

});