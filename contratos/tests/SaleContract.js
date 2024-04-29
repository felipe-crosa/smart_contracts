const { ethers } = require("hardhat");
const { expect } = require("chai");

let _systemContract;
let _coinContract;
let _itemContract;
let _saleContract;
let _user1;
let _user2;
let _user3;


describe("Sale", async function () {

    beforeEach(async function () {
        const [owner, user2, user3] = await ethers.getSigners();
        _user1 = owner
        _user2 = user2
        _user3 = user3
        _systemContract = await ethers.deployContract("System", [], {});
        _coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
        _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
        await _systemContract.addContract("coins", _coinContract.address)
        await _systemContract.addContract("items", _itemContract.address)
        await _coinContract.setPrice(1)
        await _coinContract.mint(10, _user1.address, { value: 10 })
        await _coinContract.mint(10, _user2.address, { value: 10 })
        await _coinContract.mint(10, _user3.address, { value: 10 })
        await _itemContract.setMintingPrice(1)
        await _itemContract.mint("test", "123")
    });

    describe("Deployment", function () {
        it("Test Deploy", async function () {
            await ethers.deployContract("Sale", [_systemContract.address], {});
        });

        it("Invalid system contract address", async function () {
            await expect(ethers.deployContract("Sale", [ethers.constants.AddressZero], {})).to.be.rejectedWith("Invalid _systemContract");
        });
    });

    
    describe("Make Offer", function () {
        it("Successful", async function () {
            _saleContract = await ethers.deployContract("Sale", [_systemContract.address], {});
            await _systemContract.addContract('sales', _saleContract.address)
            initialCoins = await _coinContract.balanceOf(_user2.address)
            await _saleContract.connect(_user2).publishOffer(1,5)
            await expect((await _saleContract.userSentOffers(_user2.address)).length).to.be.equal(1)
            await expect((await _saleContract.userReceivedOffers(_user1.address)).length).to.be.equal(1)
            await expect((await _saleContract.offerMetadata(1)).status).to.be.equal(2)
            finalCoins = await _coinContract.balanceOf(_user2.address)
            expect(finalCoins).to.be.equal(initialCoins - 5)
        });

        it("Invalid token", async function () {
            _saleContract = await ethers.deployContract("Sale", [_systemContract.address], {});
            await _systemContract.addContract('sales', _saleContract.address)
        
            await expect(_saleContract.connect(_user2).publishOffer(10,5)).to.be.rejectedWith("Invalid token")
        });

        it("Own token", async function () {
            _saleContract = await ethers.deployContract("Sale", [_systemContract.address], {});
            await _systemContract.addContract('sales', _saleContract.address)
            
            await expect(_saleContract.publishOffer(1,5)).to.be.rejectedWith("Cannot make offer for a token you own")
        });

        it("Insufficient balance", async function () {
            _saleContract = await ethers.deployContract("Sale", [_systemContract.address], {});
            await _systemContract.addContract('sales', _saleContract.address)
            
            await expect(_saleContract.connect(_user2).publishOffer(1,20)).to.be.rejectedWith("Insuficient balance")
        });

    });

    describe("Cancel Offer", function () {
        it("Successful", async function () {
            _saleContract = await ethers.deployContract("Sale", [_systemContract.address], {});
            await _systemContract.addContract('sales', _saleContract.address)
            await _saleContract.connect(_user2).publishOffer(1,5)
            userBalance = await _coinContract.balanceOf(_user2.address)
            await _saleContract.connect(_user2).cancelOffer(1)
            metadata = await _saleContract.offerMetadata(1)
            await expect(metadata.status).to.be.equal(3)
            userFinalBalance = await _coinContract.balanceOf(_user2.address)
            expect(+userFinalBalance).to.be.equal(+userBalance + (+metadata.amount))
        });

        it("Nonexisting offer", async function () {
            _saleContract = await ethers.deployContract("Sale", [_systemContract.address], {});
            await _systemContract.addContract('sales', _saleContract.address)
            await expect(_saleContract.connect(_user2).cancelOffer(10)).to.be.rejectedWith("Invalid offer")
        });

        it("Accepted offer", async function () {
            _saleContract = await ethers.deployContract("Sale", [_systemContract.address], {});
            await _systemContract.addContract('sales', _saleContract.address)
            await _saleContract.connect(_user2).publishOffer(1,5)
            await _saleContract.acceptOffer(1)
            await expect(_saleContract.cancelOffer(1)).to.be.rejectedWith("Offer is invalid. Status should be WAITING")
        });

        it("Not owner", async function () {
            _saleContract = await ethers.deployContract("Sale", [_systemContract.address], {});
            await _systemContract.addContract('sales', _saleContract.address)
            await _saleContract.connect(_user2).publishOffer(1,5)
            userBalance = await _coinContract.balanceOf(_user2.address)
            await expect(_saleContract.connect(_user3).cancelOffer(1)).to.be.rejectedWith('Unauthorized')
        });

    });

    describe("Reject Offer", function () {
        it("Successful", async function () {
            _saleContract = await ethers.deployContract("Sale", [_systemContract.address], {});
            await _systemContract.addContract('sales', _saleContract.address)
            await _saleContract.connect(_user2).publishOffer(1,5)

            userBalance = await _coinContract.balanceOf(_user2.address)
            await _saleContract.rejectOffer(1)
            metadata = await _saleContract.offerMetadata(1)
            await expect(metadata.status).to.be.equal(1)
            userFinalBalance = await _coinContract.balanceOf(_user2.address)
            expect(+userFinalBalance).to.be.equal(+userBalance + (+metadata.amount))
        });

        it("Nonexisting offer", async function () {
            _saleContract = await ethers.deployContract("Sale", [_systemContract.address], {});
            await _systemContract.addContract('sales', _saleContract.address)
            await expect(_saleContract.rejectOffer(10)).to.be.rejectedWith("Invalid offer")
        });

        it("Accepted offer", async function () {
            _saleContract = await ethers.deployContract("Sale", [_systemContract.address], {});
            await _systemContract.addContract('sales', _saleContract.address)
            await _saleContract.connect(_user2).publishOffer(1,5)
            await _saleContract.acceptOffer(1)
            await expect(_saleContract.rejectOffer(1)).to.be.rejectedWith("Offer is invalid. Status should be WAITING")
        });

        it("Not owner", async function () {
            _saleContract = await ethers.deployContract("Sale", [_systemContract.address], {});
            await _systemContract.addContract('sales', _saleContract.address)
            await _saleContract.connect(_user2).publishOffer(1,5)
            userBalance = await _coinContract.balanceOf(_user2.address)
            await expect(_saleContract.connect(_user3).rejectOffer(1)).to.be.rejectedWith('Unauthorized')
        });

    });


    describe("Accept Offer", function () {
        it("Successful", async function () {
            _saleContract = await ethers.deployContract("Sale", [_systemContract.address], {});
            await _systemContract.addContract('sales', _saleContract.address)
            await _saleContract.connect(_user2).publishOffer(1,5)
            await _saleContract.connect(_user3).publishOffer(1,2)

            ownerBalance = await _coinContract.balanceOf(_user1.address)
            

            await _saleContract.connect(_user1).acceptOffer(1)

            metadata = await _saleContract.offerMetadata(1)
            await expect(metadata.status).to.be.equal(0)

            ownerFinalBalance = await _coinContract.balanceOf(_user1.address)
            user3FinalBalance = await _coinContract.balanceOf(_user1.address)

            expect(+ownerFinalBalance).to.be.equal(+ownerBalance + (+metadata.amount))
            await expect(await _itemContract.ownerOf(1)).to.be.equal(_user2.address)
            await expect((await _itemContract.metadataOf(1)).amountOfOwners).to.be.equal(2)
            await expect(await _coinContract.balanceOf(_user3.address)).to.be.equal(10)
        });

        it("Nonexisting offer", async function () {
            _saleContract = await ethers.deployContract("Sale", [_systemContract.address], {});
            await _systemContract.addContract('sales', _saleContract.address)
            await expect(_saleContract.acceptOffer(10)).to.be.rejectedWith("Invalid offer")
        });

        it("Accepted offer", async function () {
            _saleContract = await ethers.deployContract("Sale", [_systemContract.address], {});
            await _systemContract.addContract('sales', _saleContract.address)
            await _saleContract.connect(_user2).publishOffer(1,5)
            await _saleContract.acceptOffer(1)
            await expect(_saleContract.acceptOffer(1)).to.be.rejectedWith("Offer is invalid. Status should be WAITING")
        });

        it("Not owner", async function () {
            _saleContract = await ethers.deployContract("Sale", [_systemContract.address], {});
            await _systemContract.addContract('sales', _saleContract.address)
            await _saleContract.connect(_user2).publishOffer(1,5)
            userBalance = await _coinContract.balanceOf(_user2.address)
            await expect(_saleContract.connect(_user3).acceptOffer(1)).to.be.rejectedWith('Unauthorized')
        });

    });
 



});