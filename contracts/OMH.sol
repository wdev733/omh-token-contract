// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "./libs/ERC20.sol";
import "./libs/Ownable.sol";

contract OMHToken is ERC20, Ownable {
    uint256 public constant FEEDOMINATOR = 10000;
    uint32 public burnFee = 200;

    mapping(address => bool) public isExcludedFromBurn;

    constructor()
        ERC20("OMVERITAS", "OMH", 18)
    {
      _mint(msg.sender, 17 * 10**8 * 10**18); // 1.7 billion

      isExcludedFromBurn[msg.sender] = true;
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (!isExcludedFromBurn[from]) {
            uint256 burnAmount = calculateTokenFee(amount, burnFee);
            uint256 tokensToTransfer = amount - burnAmount;
            if (burnAmount > 0) _burn(from, burnAmount);
            super._transfer(from, to, tokensToTransfer);
        } else {
            super._transfer(from, to, amount);
        }
    }

    function calculateTokenFee(uint256 _amount, uint32 _fee)
        public
        pure
        returns (uint256 feeAmount)
    {
        feeAmount = (_amount * _fee) / FEEDOMINATOR;
    }

    function excludeFromBurn(address account, bool value) public onlyOwner {
        isExcludedFromBurn[account] = value;
    }

    function transferOwnership(address newOwner) public override onlyOwner {
        super.transferOwnership(newOwner);
        isExcludedFromBurn[newOwner] = true;
    }
}
