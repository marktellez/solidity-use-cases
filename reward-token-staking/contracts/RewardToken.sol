//SPDX-License-Identifier:MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract RewardToken is ERC20, Ownable, ERC20Burnable {
    mapping(address => uint256) private _balances;

    constructor(uint256 initialSupply) ERC20("RewardToken", "RETK") {
        _mint(address(this), initialSupply);
        _balances[address(this)] = initialSupply;
    }

    function reward(address to, uint256 amount) public onlyOwner {
        require(_balances[address(this)] >= amount, "NotEnoughTokens");

        _transfer(address(this), to, amount);
    }

    function availableSupply() public view returns (uint256) {
        return _balances[address(this)];
    }

    function burnedSupply() public view returns (uint256) {
        return _balances[address(0)];
    }
}
