const { ethers } = require("hardhat");

async function main() {
    const systemContract = await ethers.deployContract("System", [], {});
    await systemContract.deployed();


    const coinContract = await ethers.deployContract("Coin", ["coin", "CIN", _systemContract.address], {});
    const itemContract = await ethers.deployContract("Item", [_systemContract.address], {});
    const saleContract = await ethers.deployContract("Sale", [_systemContract.address], {});

    await Promise.all([coinContract.deployed(), itemContract.deployed(), saleContract.deployed()])

    await _systemContract.addContract("coins", _coinContract.address)
    await _systemContract.addContract("items", _itemContract.address)
    await _systemContract.addContract("sales", _saleContract.address)

    await Promise.all([
        _itemContract.setMintingPrice(5),
        _coinContract.setPrice(1),
    ])

    console.log("SystemContract", systemContract.address);
    console.log("CoinContract:", coinContract.address);
    console.log("ItemContract:", itemContract.address);
    console.log("SaleContract:", saleContract.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});