//SPDX-License-Identifier:MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RewardTokenStaking {
    IERC20 private _rewardsToken;

    uint256 private _rewardRate = 100;
    uint256 private _lastUpdateTime;
    uint256 private _rewardsPerTokenCache;
    uint256 private _stakedSupply = 0;


    mapping(address => uint256) private _userRewardPerTokenPaid;
    mapping(address => uint256) private _rewards;
    mapping(address => uint256) private _balances;

    event Stake(address who, uint256 amount);
    event Withdraw(address who, uint256 amount);
    event Compound(address who, uint256 amount);

    constructor(address rewardsToken) {
        _rewardsToken = IERC20(rewardsToken);
    }

    modifier updateReward(address account) {
        _rewardsPerTokenCache = rewardPerToken();
        _lastUpdateTime = block.timestamp;

        _rewards[account] = earned(account);
        _userRewardPerTokenPaid[account] = _rewardsPerTokenCache;
        _;
    }

    function stake(uint256 amount) external updateReward(msg.sender) {
        _stakedSupply += amount;
        _balances[msg.sender] += amount;
        _rewardsToken.transferFrom(msg.sender, address(this), amount);

        emit Stake(msg.sender, amount);
    }

    function withdraw(uint256 amount) external updateReward(msg.sender) {
        _stakedSupply -= amount;
        _balances[msg.sender] -= amount;
        _rewardsToken.transfer(msg.sender, amount);

        emit Withdraw(msg.sender, amount);
    }

    function compound() external updateReward(msg.sender) {
        uint256 reward = _rewards[msg.sender];
        _rewards[msg.sender] = 0;
        _balances[msg.sender] += reward;

        emit Compound(msg.sender, reward);
    }

    function rewardPerToken() public view returns (uint256) {
        if (_stakedSupply == 0) {
            return 0;
        }

        return
            _rewardsPerTokenCache +
            ((_rewardRate * (block.timestamp - _lastUpdateTime) * 1e18) /
                _stakedSupply);
    }

    function earned(address account) public view returns (uint256) {
        return
            ((_balances[account] *
                (rewardPerToken() - _userRewardPerTokenPaid[account])) / 1e18) +
            _rewards[account];
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function stakedSupply() public view returns (uint256) {
        return _stakedSupply;
    }

      function rewardRate() public view returns (uint256) {
        return _rewardRate;
    }
}
