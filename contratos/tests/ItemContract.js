const { ethers } = require("hardhat");
const { expect } = require("chai");

let _systemContract;
let _itemContract;
let _user1;
let _user2;
let _user3;


describe("Item", async function () {

    beforeEach(async function () {
        const [owner, user2, user3] = await ethers.getSigners();
        _user1 = owner
        _user2 = user2
        _user3 = user3
    });

    describe("Deployment", function () {
        it("Test Deploy", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            await ethers.deployContract("Item", [_systemContract.address], {});
        });

        it("Invalid system contract address", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            await expect(ethers.deployContract("Item", [ethers.constants.AddressZero], {})).to.be.rejectedWith("Invalid _systemContract");
        });
    });


    

});