const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
	const { deployer } = await getNamedAccounts();
	const fundMe = await ethers.getContract("FundMe", deployer);
	console.log("Funding Contract...");
	const transactionRespose = await fundMe.fund({
		value: ethers.utils.parseEther("1"),
	});
	await transactionRespose.wait(1);
	console.log("Funded!");
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
