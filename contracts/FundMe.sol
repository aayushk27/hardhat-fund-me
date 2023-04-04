// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// get funds from users
// withdraw funds
// set minimum fund val to 50 usd

import "./PriceConverter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error FundMe__NotOwner();

/**
 * 	@title A contract for crowd funding
 * 	@author Aayush Kulkarni
 *  @notice This contract is to demo a sample funding contract
 *  @dev This implements price feeds as our library
 */
contract FundMe {
	// Type declarations
	using PriceConverter for uint256;

	// State variables
	mapping(address => uint256) private s_addressToAmountFunded;
	address[] private s_funders;
	address private immutable i_owner;
	uint256 public constant MINIMUM_USD = 50 * 1e18;
	AggregatorV3Interface private s_priceFeed;

	modifier onlyOwner() {
		if (msg.sender != i_owner) {
			revert FundMe__NotOwner();
		}
		_; // -----> calls rest code
	}

	constructor(address priceFeedAddress) {
		i_owner = msg.sender;
		s_priceFeed = AggregatorV3Interface(priceFeedAddress);
	}

	function fund() public payable {
		// set minimum fund sent 50 usd
		require(
			msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
			"You need to spend more ETH!"
		); // 1 eth = 1e18 wei
		s_addressToAmountFunded[msg.sender] += msg.value;
		s_funders.push(msg.sender);
	}

	function withdraw() public onlyOwner {
		for (uint256 i = 0; i < s_funders.length; i++) {
			address funder = s_funders[i];
			s_addressToAmountFunded[funder] = 0;
		}
		s_funders = new address[](0); //reset the arr
		//withdraw 3 diff ways
		//transfer, send and call
		// payable(msg.sender.transfer(address(this).balance)); ----> transfer
		// bool sendSuccess = payable(msg.sender).send(address(this).balance); ----> send
		// require(sendSuccess, "send failed");

		(bool callSuccess, ) = payable(msg.sender).call{
			value: address(this).balance
		}("");
		require(callSuccess, "Call failed");
	}

	function cheaperWithdraw() public onlyOwner {
		address[] memory funders = s_funders;
		for (uint256 i = 0; i < funders.length; i++) {
			address funder = funders[i];
			s_addressToAmountFunded[funder] = 0;
		}
		s_funders = new address[](0);
		(bool success, ) = i_owner.call{value: address(this).balance}("");
		require(success);
	}

	function getAddressToAmountFunded(
		address fundingAddress
	) public view returns (uint256) {
		return s_addressToAmountFunded[fundingAddress];
	}

	function getVersion() public view returns (uint256) {
		return s_priceFeed.version();
	}

	function getFunder(uint256 index) public view returns (address) {
		return s_funders[index];
	}

	function getOwner() public view returns (address) {
		return i_owner;
	}

	function getPriceFeed() public view returns (AggregatorV3Interface) {
		return s_priceFeed;
	}
}
