// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.11;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract USDT is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("USDT", "USDT")
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

//0x65D96C8e428595a174ad6926fFfB4E2365820918

//0xC4CF91056A704445341A3BEB7966ab91b0a1b09D - new