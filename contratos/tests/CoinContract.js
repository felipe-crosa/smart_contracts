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


    describe("Transfer", async function () {
        it("Successful Transfer", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(1)
            await _coinContract.mint(10, _user1.address, { value: 10 })
            await _coinContract.transfer(_user2.address, 5)
            await expect(await _coinContract.balanceOf(_user2.address)).to.be.equal(5);
            await expect(await _coinContract.balanceOf(_user1.address)).to.be.equal(5);
        });

        it("Transfer more than balance", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(1)
            await _coinContract.mint(10, _user1.address, { value: 10 })
            await expect(_coinContract.transfer(_user2.address, 15)).to.be.revertedWith("Not enough balance")
        });

        it("Transfer 0", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await expect(_coinContract.transfer(_user2.address, 0)).to.be.revertedWith("_value has to be greater than 0")
        });

        it("Transfer to address 0", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(1)
            await _coinContract.mint(10, _user1.address, { value: 10 })
            await expect(_coinContract.transfer(ethers.constants.AddressZero, 10)).to.be.revertedWith("_to is an invalid address")
        });
    });

    describe("TransferFrom", async function () {
        it("Successful Transfer From as Owner", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(1)
            await _coinContract.mint(10, _user1.address, { value: 10 })
            await _coinContract.transferFrom(_user1.address, _user2.address, 5)
            await expect(await _coinContract.balanceOf(_user2.address)).to.be.equal(5);
            await expect(await _coinContract.balanceOf(_user1.address)).to.be.equal(5);
        });

        it("Transfer From without sufficient allowance", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(1)
            await _coinContract.mint(10, _user1.address, { value: 10 })
            await expect(_coinContract.connect(_user2).transferFrom(_user1.address, _user2.address, 5)).to.be.rejectedWith("Insufficient allowance")
        });

        it("Transfer From With allowance", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(1)
            await _coinContract.mint(10, _user1.address, { value: 10 })
            await _coinContract.approve(_user2.address, 5)
            await _coinContract.connect(_user2).transferFrom(_user1.address, _user2.address, 5)
            await expect(await _coinContract.balanceOf(_user2.address)).to.be.equal(5);
            await expect(await _coinContract.balanceOf(_user1.address)).to.be.equal(5);
            await expect(await _coinContract.allowance(_user1.address, _user2.address)).to.be.equal(0)
        });

        it("Transfer From Without allowance but from internal contract", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(1)
            await _coinContract.mint(10, _user2.address, { value: 10 })
            await _coinContract.connect(_user1).transferFrom(_user2.address, _user3.address, 5)
            await expect(await _coinContract.balanceOf(_user2.address)).to.be.equal(5);
            await expect(await _coinContract.balanceOf(_user3.address)).to.be.equal(5);
        });


        it("TransferFrom more than balance", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(1)
            await _coinContract.mint(10, _user1.address, { value: 10 })        
            await expect(_coinContract.transferFrom(_user1.address, _user2.address, 15)).to.be.revertedWith("Not enough balance")
        });

        it("Transfer 0", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(1)
            await _coinContract.mint(10, _user1.address, { value: 10 })        
            await expect(_coinContract.transferFrom(_user1.address, _user2.address, 0)).to.be.revertedWith("_value has to be greater than 0")
        });

        it("Transfer to address 0", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(1)
            await _coinContract.mint(10, _user1.address, { value: 10 })        
            await expect(_coinContract.transferFrom(_user1.address, ethers.constants.AddressZero, 1)).to.be.revertedWith("_to is an invalid address")
        });

        it("Transfer from address 0", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await expect(_coinContract.transferFrom(ethers.constants.AddressZero,  _user1.address,1)).to.be.revertedWith("_from is an invalid address")
        });
    });
    
    describe("Approve and Allowance", function () {
        it("Approve user successfuly", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(1)
            await _coinContract.mint(10, _user1.address, { value: 10 })        
            await _coinContract.approve(_user2.address, 10)
            await expect(await _coinContract.allowance(_user1.address, _user2.address)).to.be.equal(10);
        });

        it("Approve user with more than current balance", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await expect(_coinContract.approve(_user2.address, 10)).to.be.revertedWith("Not enough balance");
        });

        it("Approve user which already has allowance", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(1)
            await _coinContract.mint(10, _user1.address, { value: 10 })        
            await _coinContract.approve(_user2.address, 10)
            await expect(_coinContract.approve(_user2.address, 10)).to.be.revertedWith("_spender already has an allowance. Set to 0 before assigning new value.");
        });

        it("Approve address 0", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await expect(_coinContract.approve(ethers.constants.AddressZero, 10)).to.be.revertedWith("_spender is an invalid address");
        });
    });

    describe("Set Price", function () {
        it("set price successful", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(100)
            await expect(await _coinContract.price()).to.be.equal(100);
        });

        it("set price to 0", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await expect(_coinContract.setPrice(0)).to.be.rejectedWith("_price has to be greater than 0")
        });

        it("set price when not owner nor internal contract", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await expect(_coinContract.connect(_user2).setPrice(10)).to.be.rejectedWith("Unauthorized action")
        });
    });


    describe("Mint", function () {
        it("Mint successful", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(2)
            await    
            await expect(_coinContract.mint(5, _user1.address, { value: 10 })).to.changeEtherBalance(_user1, "-10");
            await expect(await _coinContract.balanceOf(_user1.address)).to.be.equal(5);
            await expect(await _coinContract.totalSupply()).to.be.equal(5);
        });

        it("mint with insufficient balance", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(2)
            await expect(_coinContract.mint(100, _user1.address, { value: 10 })).to.be.rejectedWith("Insufficient ether")  
        });

        it("mint with exceeding balance", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await _coinContract.setPrice(2)
            await    
            await expect(_coinContract.mint(5, _user1.address, { value: 100 })).to.changeEtherBalance(_user1, "-10");
            await expect(await _coinContract.balanceOf(_user1.address)).to.be.equal(5);
        });

        it("mint 0", async function () {
            _systemContract = await ethers.deployContract("System", [], {});
            _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
            await expect(_coinContract.mint(0, _user1.address)).to.be.rejectedWith("Invalid _amount")
        });
    });

});