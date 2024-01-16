// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
import "@openzeppelin/contracts@4.4.1/token/ERC20/ERC20.sol";

contract Fc_token is ERC20{
    constructor () ERC20("Factcheck Token", "fc") {
        _mint(address(this), 1000000000*10**decimals());
        _mint(msg.sender,10000000000*10**decimals());
    }
}
