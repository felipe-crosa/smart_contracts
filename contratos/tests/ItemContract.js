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

    describe("Mint", function () {
        it("mint successful", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await _itemContract.setMintingPrice(1);
            await _itemContract.mint("test", "123")
            await expect(await _itemContract.totalSupply()).to.be.equal(1)
            await expect((await _itemContract.metadataOf(1)).name).to.equal("test")
            await expect((await _itemContract.metadataOf(1)).amountOfOwners).to.equal(1)
            await expect((await _itemContract.metadataOf(1)).creator).to.equal(_user1.address)
            await expect((await _itemContract.metadataOf(1)).imageURL).to.equal("123")
            await expect(await _coinContract.balanceOf(_user1.address)).to.be.equal(9)
        });

        it("mint with insufficient balance", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await _itemContract.setMintingPrice(1000);
            await expect(_itemContract.mint("test", "123")).to.be.rejectedWith("Not enough balance")
        });
    })

    describe("Is Token Valid", function () {
        it("valid token", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await _itemContract.setMintingPrice(1);
            await _itemContract.mint("test", "123")
            await expect(await _itemContract.isValidToken(1)).to.be.equal(true)
        });

        it("invalid token", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await expect(await _itemContract.isValidToken(1)).to.be.equal(false)
        });
    })

    describe("Balance Of", function () {
        it("one nft", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await _itemContract.setMintingPrice(1);
            await _itemContract.mint("test", "123")
            await expect(await _itemContract.balanceOf(_user1.address)).to.be.equal(1)
        });

        it("two nft", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await _itemContract.setMintingPrice(1);
            await _itemContract.mint("test", "123")
            await _itemContract.mint("test2", "1234")
            await expect(await _itemContract.balanceOf(_user1.address)).to.be.equal(2)
        });

        it("zero nft", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await expect(await _itemContract.balanceOf(_user1.address)).to.be.equal(0)
        });
    })

    describe("Owner Of", function () {
        it("existing nft", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await _itemContract.setMintingPrice(1);
            await _itemContract.mint("test", "123")
            await expect(await _itemContract.ownerOf(1)).to.be.equal(_user1.address)
        });

        it("non existing nft", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await expect(await _itemContract.ownerOf(1)).to.be.equal(ethers.constants.AddressZero)
        });
    })

    describe("Approve", function () {
        it("approve user successful", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await _itemContract.setMintingPrice(1);
            await _itemContract.mint("test", "123")

            await _itemContract.approve(_user2.address, 1)
            await expect(await _itemContract.getApproved(1)).to.be.equal(_user2.address)

        });
        it("approve of not owned token", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await _itemContract.setMintingPrice(1);
            await _itemContract.mint("test", "123")

            await expect(_itemContract.connect(_user3).approve(_user2.address, 1)).to.be.rejectedWith("Not authorized")
        });
        it("approve as internal contract", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await _systemContract.addContract("test", _user3.address)
            await _itemContract.setMintingPrice(1);
            await _itemContract.mint("test", "123")

            await _itemContract.connect(_user3).approve(_user2.address, 1)
            await expect(await _itemContract.getApproved(1)).to.be.equal(_user2.address)
        });
        it("approve non existing token", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await expect(_itemContract.approve(_user2.address, 1)).to.be.rejectedWith("Invalid _tokenId")
        });

        it("approve address 0", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await _itemContract.setMintingPrice(1);
            await _itemContract.mint("test", "123")

            await expect(_itemContract.approve(ethers.constants.AddressZero, 1)).to.be.rejectedWith("Invalid _to address")
        });
    })
    
    describe("Approve For All", function () {
        it("approve user successful", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)

            await _itemContract.setApprovalForAll(_user2.address, true)
            await expect(await _itemContract.isApprovedForAll(_user1.address, _user2.address)).to.be.equal(true)

        });

        it("remove user approval successful", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await _itemContract.setApprovalForAll(_user2.address, true)
            await expect(await _itemContract.isApprovedForAll(_user1.address, _user2.address)).to.be.equal(true)
            await _itemContract.setApprovalForAll(_user2.address, false)
            await expect(await _itemContract.isApprovedForAll(_user1.address, _user2.address)).to.be.equal(false)
        });

        it("approve address 0", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)

            await expect(_itemContract.setApprovalForAll(ethers.constants.AddressZero, true)).to.be.rejectedWith("Invalid _operator address")
        });
    
    })
    
    describe("Transfer From", function () {
        it("transfer from own account", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await _itemContract.setMintingPrice(1);
            await _itemContract.mint("test", "123")

            await _itemContract.transferFrom(_user1.address, _user2.address, 1)
            await expect(await _itemContract.ownerOf(1)).to.be.equal(_user2.address)
            await expect((await _itemContract.metadataOf(1)).amountOfOwners).to.be.equal(2)
        });
        it("transfer with approval", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await _itemContract.setMintingPrice(1);
            await _itemContract.mint("test", "123")
            await _itemContract.approve(_user2.address, 1)

            await _itemContract.connect(_user2).transferFrom(_user1.address, _user2.address, 1)
            await expect(await _itemContract.ownerOf(1)).to.be.equal(_user2.address)
        });
        it("transfer with full approval", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await _itemContract.setMintingPrice(1);
            await _itemContract.mint("test", "123")
            await _itemContract.setApprovalForAll(_user2.address, true)

            await _itemContract.connect(_user2).transferFrom(_user1.address, _user2.address, 1)
            await expect(await _itemContract.ownerOf(1)).to.be.equal(_user2.address)
        });
        it("transfer from internal contract", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await _itemContract.setMintingPrice(1);
            await _itemContract.mint("test", "123")
            _systemContract.addContract("internal", _user3.address)

            await _itemContract.connect(_user3).transferFrom(_user1.address, _user2.address, 1)
            await expect(await _itemContract.ownerOf(1)).to.be.equal(_user2.address)
        });
        it("transfer non existing token", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await expect(_itemContract.transferFrom(_user1.address, _user2.address, 1)).to.be.rejectedWith("Invalid _tokenId")
        });
        
        it("transfer to address 0", async function () {
            _itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
            await _systemContract.addContract("items", _itemContract.address)
            await _itemContract.setMintingPrice(1);
            await _itemContract.mint("test", "123")
            await expect(_itemContract.transferFrom(_user1.address, ethers.constants.AddressZero, 1)).to.be.rejectedWith("Invalid address")
        });
       
    })
    


 



});