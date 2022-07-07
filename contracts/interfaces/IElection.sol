// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import {DataTypes} from '../libraries/DataTypes.sol';

interface IElection {
    function createCandidate(DataTypes.CreateCandidateData calldata vars) external;

    function vote(address candidate) external returns (uint256);

    function getVoteNFT(address candidate) external view returns (address);

    function getHandle(address candidate) external view returns (string memory);

    function getVoteNFTURI(address candidate) external view returns (string memory);

    function emitVoteNFTTransferEvent(
        address candidate,
        uint256 voteNFTId,
        address from,
        address to
    ) external;

    function getVotes(address candidate) external view returns (uint256);

    function getVoteNFTImpl() external view returns (address);
}
