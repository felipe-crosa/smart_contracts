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

    const [a,b] = await Promise.all([
        itemContract.setMintingPrice(1),
        coinContract.setPrice(1),
    ])
    await b.wait(1)
    await coinContract.mint(100, "0x0b7c3a4ddedd542f76ebaed43149b336107285e2", { value: 100 })

    console.log("SystemContract", systemContract.address);
    console.log("CoinContract:", coinContract.address);
    console.log("ItemContract:", itemContract.address);
    console.log("SaleContract:", saleContract.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});