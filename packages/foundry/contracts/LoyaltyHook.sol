// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Simplified Uniswap v4 Hook interface for demo
interface IPoolManager {
    function getPool(address token0, address token1, uint24 fee) external view returns (address pool);
}

// For simplicity, we'll create a standalone loyalty system that tracks streaks
contract LoyaltyHook {
    // State Variables
    address public immutable owner;

    // User streak tracking
    struct UserStreak {
        uint256 lastTradeTimestamp;
        uint256 streakCount;
        uint256 totalVolume;
    }

    mapping(address => UserStreak) public userStreaks;

    // Constants
    uint256 public constant STREAK_WINDOW = 24 hours;
    uint256 public constant BASE_FEE = 30; // 0.30% in basis points
    uint256 public constant DISCOUNTED_FEE = 15; // 0.15% in basis points
    uint256 public constant STREAK_THRESHOLD = 3; // Need 3+ days for discount

    // Events
    event StreakUpdated(address indexed user, uint256 newStreak, uint256 discountApplied);
    event TradeExecuted(address indexed user, uint256 amount, uint256 timestamp);

    // Constructor
    constructor(address _owner) {
        owner = _owner;
    }

    // Modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /**
     * @dev Calculate current fee based on user's streak
     * @param user Address to check streak for
     * @return feeInBps Fee in basis points (e.g., 30 for 0.30%)
     */
    function getFeeForUser(address user) public view returns (uint256) {
        UserStreak memory streak = userStreaks[user];

        if (streak.streakCount >= STREAK_THRESHOLD) {
            return DISCOUNTED_FEE;
        }

        return BASE_FEE;
    }

    /**
     * @dev Simulate beforeSwap hook - returns discount fee
     * In real Uniswap v4, this would be called by PoolManager
     */
    function beforeSwap(address user, uint256 amount) public returns (uint256) {
        uint256 fee = getFeeForUser(user);

        // Emit event for frontend tracking
        emit TradeExecuted(user, amount, block.timestamp);

        return fee;
    }

    /**
     * @dev Simulate afterSwap hook - updates user streak
     * In real Uniswap v4, this would be called by PoolManager after swap completes
     */
    function afterSwap(address user) public {
        UserStreak storage streak = userStreaks[user];

        // Check if user has traded before
        if (streak.lastTradeTimestamp == 0) {
            // First trade
            streak.streakCount = 1;
        } else {
            // Check if within streak window (24 hours)
            uint256 timeSinceLastTrade = block.timestamp - streak.lastTradeTimestamp;

            if (timeSinceLastTrade <= STREAK_WINDOW) {
                // Maintain streak
                streak.streakCount += 1;
            } else {
                // Reset streak (missed the window)
                streak.streakCount = 1;
            }
        }

        // Update last trade timestamp
        streak.lastTradeTimestamp = block.timestamp;

        // Emit event
        emit StreakUpdated(user, streak.streakCount, getFeeForUser(user));
    }

    /**
     * @dev Get user streak info for frontend display
     */
    function getUserStreakInfo(address user) external view returns (
        uint256 lastTradeTimestamp,
        uint256 streakCount,
        uint256 totalVolume,
        uint256 currentFee,
        uint256 nextDeadline
    ) {
        UserStreak memory streak = userStreaks[user];

        lastTradeTimestamp = streak.lastTradeTimestamp;
        streakCount = streak.streakCount;
        totalVolume = streak.totalVolume;
        currentFee = getFeeForUser(user);

        // Calculate next deadline to maintain streak
        if (streak.lastTradeTimestamp > 0) {
            nextDeadline = streak.lastTradeTimestamp + STREAK_WINDOW;
        } else {
            nextDeadline = 0;
        }
    }

    /**
     * @dev For demo purposes - simulate a trade to test the system
     */
    function simulateTrade(address user, uint256 amount) external {
        // Call beforeSwap to get fee
        uint256 fee = getFeeForUser(user);

        // Update total volume
        userStreaks[user].totalVolume += amount;

        // Update streak (simulating afterSwap logic)
        UserStreak storage streak = userStreaks[user];

        if (streak.lastTradeTimestamp == 0) {
            streak.streakCount = 1;
        } else {
            uint256 timeSinceLastTrade = block.timestamp - streak.lastTradeTimestamp;
            if (timeSinceLastTrade <= STREAK_WINDOW) {
                streak.streakCount += 1;
            } else {
                streak.streakCount = 1;
            }
        }

        streak.lastTradeTimestamp = block.timestamp;

        // Emit events
        emit TradeExecuted(user, amount, block.timestamp);
        emit StreakUpdated(user, streak.streakCount, fee);
    }
}