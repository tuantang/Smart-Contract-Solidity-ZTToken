// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ZTToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("ZanT Token", "ZTT") {
        _mint(msg.sender, initialSupply);
    }
 
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}