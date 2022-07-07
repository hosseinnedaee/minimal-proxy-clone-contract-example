// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

library Events {
    event VoteNFTInitialized(address indexed candidate, uint256 timestamp);
    event VoteNFTTransferred(
        address indexed candidate,
        uint256 indexed voteNFTId,
        address from,
        address to,
        uint256 timestamp
    );
    event CandidateCreated(
        address indexed creator,
        address indexed candidate,
        string handle,
        string voteNFTURI,
        uint256 timestamp
    );
    event Voted(address indexed voter, address indexed candidate, uint256 timestamp);
    event VoteNFTDeployed(address indexed candidate, address indexed voteNFT, uint256 timestamp);
}
