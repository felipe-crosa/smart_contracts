const { ethers } = require("hardhat");
const { expect } = require("chai");

let _systemContract;
let _coinContract;
let _user1;
let _user2;
let _user3;


describe("Coin", async function () {

    beforeEach(async function () {
        const [owner, user2, user3] = await ethers.getSigners();
        _user1 = owner
        _user2 = user2
        _user3 = user3
    });

    describe("Deployment", function () {
        it("Test Deploy", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
        });

        it("Invalid name", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            await expect(ethers.deployContract("Coin", ["", "COI", _systemContract.address], {})).to.be.rejectedWith("Invalid _name");
        });

        it("Invalid symbol with length < 3", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            await expect(ethers.deployContract("Coin", ["Coin", "CI", _systemContract.address], {})).to.be.rejectedWith("Invalid _symbol");
        });

        it("Invalid symbol with length > 3", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            await expect(ethers.deployContract("Coin", ["Coin", "1234", _systemContract.address], {})).to.be.rejectedWith("Invalid _symbol");
        });

        it("Invalid system contract address", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            await expect(ethers.deployContract("Coin", ["Coin", "CIN", ethers.constants.AddressZero], {})).to.be.rejectedWith("Invalid _systemContract");
        });
    });

    

});