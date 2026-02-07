// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/LoyaltyHook.sol";

/**
 * @notice Deploy script for LoyaltyHook contract
 */
contract DeployLoyaltyHook is ScaffoldETHDeploy {
    /**
     * @dev Deploy LoyaltyHook contract
     */
    function run() external ScaffoldEthDeployerRunner {
        // Deploy LoyaltyHook with deployer as owner
        LoyaltyHook loyaltyHook = new LoyaltyHook(deployer);

        // Log the deployed contract address
        console.log("LoyaltyHook deployed at:", address(loyaltyHook));
    }
}