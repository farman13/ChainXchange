// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.11;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract USDC is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("USDC", "USDC")
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

//0x46e75BB06dDF1DCA6A9C25AF8a1557aEe07c5616

//0x10F8106cBE82662b1691c33Cb9f277DCD72ea7F0 - new