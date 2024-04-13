async function main() {

    const contractFactory = await ethers.getContractFactory('Library');
    const contract = await contractFactory.deploy();
    await contract.waitForDeployment();
   
    // Get and print the contract address
    const myContractDeployedAddress = await contract.getAddress();
    console.log(`Deployed to ${myContractDeployedAddress}`);
    process.exit(0);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});