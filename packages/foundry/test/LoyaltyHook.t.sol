// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../contracts/LoyaltyHook.sol";

contract LoyaltyHookTest is Test {
    LoyaltyHook public loyaltyHook;
    address public owner = address(0x123);
    address public user1 = address(0x456);
    address public user2 = address(0x789);

    function setUp() public {
        vm.startPrank(owner);
        loyaltyHook = new LoyaltyHook(owner);
        vm.stopPrank();
    }

    function testInitialFee() public {
        uint256 fee = loyaltyHook.getFeeForUser(user1);
        assertEq(fee, 30, "Initial fee should be 0.30% (30 bps)");
    }

    function testFirstTrade() public {
        vm.startPrank(user1);

        // First trade
        loyaltyHook.simulateTrade(user1, 1 ether);

        // Check streak after first trade
        (uint256 lastTradeTime, uint256 streakCount, , uint256 currentFee, ) = loyaltyHook.getUserStreakInfo(user1);

        assertEq(streakCount, 1, "First trade should start streak at 1");
        assertEq(currentFee, 30, "Fee should still be 0.30% after 1 day");
        assertGt(lastTradeTime, 0, "Last trade time should be set");

        vm.stopPrank();
    }

    function testStreakMaintenance() public {
        vm.startPrank(user1);

        // Day 1
        loyaltyHook.simulateTrade(user1, 1 ether);

        // Move forward 12 hours (within streak window)
        vm.warp(block.timestamp + 12 hours);

        // Day 2 (within 24h window)
        loyaltyHook.simulateTrade(user1, 1 ether);

        (, uint256 streakCount2, , , ) = loyaltyHook.getUserStreakInfo(user1);
        assertEq(streakCount2, 2, "Streak should be 2 after trading within window");

        // Move forward another 12 hours (still within window from last trade)
        vm.warp(block.timestamp + 12 hours);

        // Day 3
        loyaltyHook.simulateTrade(user1, 1 ether);

        (, uint256 streakCount3, , uint256 fee3, ) = loyaltyHook.getUserStreakInfo(user1);
        assertEq(streakCount3, 3, "Streak should be 3");
        assertEq(fee3, 15, "Fee should drop to 0.15% after 3+ day streak");

        vm.stopPrank();
    }

    function testStreakBreak() public {
        vm.startPrank(user1);

        // Day 1
        loyaltyHook.simulateTrade(user1, 1 ether);

        // Move forward 25 hours (outside streak window)
        vm.warp(block.timestamp + 25 hours);

        // Day "2" (but streak broken)
        loyaltyHook.simulateTrade(user1, 1 ether);

        (, uint256 streakCount, , uint256 fee, ) = loyaltyHook.getUserStreakInfo(user1);
        assertEq(streakCount, 1, "Streak should reset to 1 after missing window");
        assertEq(fee, 30, "Fee should be back to 0.30% after streak break");

        vm.stopPrank();
    }

    function testVolumeTracking() public {
        vm.startPrank(user1);

        loyaltyHook.simulateTrade(user1, 1 ether);
        loyaltyHook.simulateTrade(user1, 2 ether);

        (, , uint256 totalVolume, , ) = loyaltyHook.getUserStreakInfo(user1);
        assertEq(totalVolume, 3 ether, "Total volume should be 3 ETH");

        vm.stopPrank();
    }

    function testMultipleUsers() public {
        vm.startPrank(user1);
        loyaltyHook.simulateTrade(user1, 1 ether);
        vm.stopPrank();

        vm.startPrank(user2);
        loyaltyHook.simulateTrade(user2, 2 ether);
        vm.stopPrank();

        // Check user1
        (, uint256 streak1, uint256 volume1, , ) = loyaltyHook.getUserStreakInfo(user1);
        assertEq(streak1, 1, "User1 streak should be 1");
        assertEq(volume1, 1 ether, "User1 volume should be 1 ETH");

        // Check user2
        (, uint256 streak2, uint256 volume2, , ) = loyaltyHook.getUserStreakInfo(user2);
        assertEq(streak2, 1, "User2 streak should be 1");
        assertEq(volume2, 2 ether, "User2 volume should be 2 ETH");
    }

    function testEventsEmitted() public {
        vm.startPrank(user1);

        // Expect events to be emitted
        vm.expectEmit(true, false, false, false);
        emit LoyaltyHook.TradeExecuted(user1, 1 ether, block.timestamp);

        vm.expectEmit(true, false, false, false);
        emit LoyaltyHook.StreakUpdated(user1, 1, 30);

        loyaltyHook.simulateTrade(user1, 1 ether);

        vm.stopPrank();
    }
}