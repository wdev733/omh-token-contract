// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./interfaces/IERC20.sol";

contract Vesting {
    address public token;
    bytes32 public merkleRoot;

    uint256 public vestingStartTime;
    uint256 public vestingDuration;

    // Array for claimed tokens
    mapping(address => uint256) private userClaimedAmount;

    // This event is triggered whenever a call to #claim succeeds.
    event Claimed(address account, uint256 amount);

    constructor(
        address token_,
        bytes32 merkleRoot_,
        uint256 vestingStartTime_,
        uint256 vestingDuration_
    ) {
        token = token_;
        merkleRoot = merkleRoot_;
        vestingStartTime = vestingStartTime_;
        vestingDuration = vestingDuration_;
    }

    function claim(
        address account,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) external {
        require(
            block.timestamp > vestingStartTime,
            "Claim: Pool is not started"
        );

        // Verify the merkle proof.
        bytes32 node = keccak256(abi.encodePacked(account, amount));
        require(
            MerkleProof.verify(merkleProof, merkleRoot, node),
            "Claim: Invalid proof"
        );

        // Get claimable amount
        uint256 applicableTime = (block.timestamp >=
            (vestingStartTime + vestingDuration))
            ? vestingDuration
            : block.timestamp - vestingStartTime;
        uint256 claimableAmount = (amount / vestingDuration) *
            applicableTime -
            userClaimedAmount[account];

        require(claimableAmount > 0, "Claim: No claimable amount");

        // Mark it claimed and send the token.
        userClaimedAmount[account] += claimableAmount;
        require(
            IERC20(token).transfer(account, amount),
            "Claim: Transfer failed"
        );

        emit Claimed(account, claimableAmount);
    }

  function getUserClaimed(address account) public view returns (uint256) {
    return userClaimedAmount[account];
  }
}
