const { network, ethers, getNamedAccounts } = require("hardhat");
const { assert } = require("chai");
const { developmentChain } = require("../../helper-hardhat-config");

developmentChain.includes(network.name)
	? describe.skip
	: describe("FundMe Staging Tests", function () {
			let fundMe;
			let deployer;
			const sendValue = ethers.utils.parseEther("0.1");

			beforeEach(async () => {
				deployer = (await getNamedAccounts()).deployer;
				fundMe = await ethers.getContract("FundMe", deployer);
			});

			it("allows people to fund and withdraw", async function () {
				await fundMe.fund({ value: sendValue });
				// await fundTxResponse.wait(6);
				await fundMe.withdraw();
				// await withdrawTxResponse.wait(6);

				const endingBalance = await fundMe.provider.getBalance(
					fundMe.address
				);

				console.log(
					endingBalance.toString() +
						" should equal 0, running assert equal..."
				);
				assert.equal(endingBalance.toString(), "0");
			});
	  });
