const { ethers } = require("hardhat");
const { expect } = require("chai");

let _systemContract;
let _itemContract;
let _coinContract;
let _user1;
let _user2;
let _user3;


describe("Item", async function () {

    beforeEach(async function () {
        const [owner, user2, user3] = await ethers.getSigners();
        _user1 = owner
        _user2 = user2
        _user3 = user3
        _systemContract = await ethers.deployContract("System", [], {});
        _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
        await _systemContract.addContract("coins", _coinContract.address)
        await _coinContract.setPrice(1)
        await _coinContract.mint(10, _user1.address, { value: 10 })
    });

    describe("Deployment", function () {
        it("Test Deploy", async function () {
            await ethers.deployContract("Item", [_systemContract.address], {});
        });

        it("Invalid system contract address", async function () {
            await expect(ethers.deployContract("Item", [ethers.constants.AddressZero], {})).to.be.rejectedWith("Invalid _systemContract");
        });
    });

    describe("Set Minting Price", function () {
        it("set price successful", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _itemContract.setMintingPrice(100);
            await expect(await _itemContract.mintPrice()).to.be.equal(100)
        });

        it("set price when not owner", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await expect(_itemContract.connect(_user2).setMintingPrice(100)).to.be.rejectedWith("Unauthorized action.");
        });

        it("set price to 0", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await expect(_itemContract.setMintingPrice(0)).to.be.rejectedWith("_mintPrice has to be bigger than 0");
        });

    });

 



});