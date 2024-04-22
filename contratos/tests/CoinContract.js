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

    describe("Name", function () {
        it("Success get name", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await expect(await _coinContract.name()).to.be.equal("coin");
        });
    });

    describe("Symbol", function () {
        it("Success get symbol", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await expect(await _coinContract.symbol()).to.be.equal("CIN");
        });
    });

    describe("Decimals", function () {
        it("Success get decimals", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await expect(await _coinContract.decimals()).to.be.equal(18);
        });
    });

    describe("Total Supply", function () {
        it("Starts as 0", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await expect(await _coinContract.totalSupply()).to.be.equal(0);
        });

        it("Increases when new are minted", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(1)
            await _coinContract.mint(10, _user2.address, { value: 10 })
            await expect(await _coinContract.totalSupply()).to.be.equal(10);
        });
    });

    describe("Balance Of", function () {
        it("Starts as 0 for all users", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await expect(await _coinContract.balanceOf(_user2.address)).to.be.equal(0);
        });

        it("User has balance", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(1)
            await _coinContract.mint(10, _user2.address, { value: 10 })
            await expect(await _coinContract.balanceOf(_user2.address)).to.be.equal(10);
        });
    });

});