const { ethers } = require("hardhat");

async function main() {
    const systemContract = await ethers.deployContract("System", [], {});
    await systemContract.deployed();


    const coinContract = await ethers.deployContract("Coin", ["coin", "CIN", systemContract.address], {});
    const itemContract = await ethers.deployContract("Item", [ systemContract.address], {});
    const saleContract = await ethers.deployContract("Sale", [ systemContract.address], {});

    await Promise.all([coinContract.deployed(), itemContract.deployed(), saleContract.deployed()])

    await systemContract.addContract("coins", coinContract.address)
    await systemContract.addContract("items", itemContract.address)
    await systemContract.addContract("sales", saleContract.address)

    await Promise.all([
        itemContract.setMintingPrice(5),
        coinContract.setPrice(1),
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