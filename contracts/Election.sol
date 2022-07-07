// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import {ElectionStorage} from './ElectionStorage.sol';
import {IElection} from './interfaces/IElection.sol';
import {Errors} from './libraries/Errors.sol';
import {Events} from './libraries/Events.sol';
import {DataTypes} from './libraries/DataTypes.sol';
import {Constants} from './libraries/Constants.sol';
import {IVoteNFT} from './interfaces/IVoteNFT.sol';
import {IERC721Enumerable} from '@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol';
import {VoteNFTProxy} from './upgradeability/VoteNFTProxy.sol';

contract Election is ElectionStorage, IElection {
    address internal immutable VOTE_NFT_IMPL;

    constructor(address voteNFTImpl) {
        if (voteNFTImpl == address(0)) revert Errors.InitParamsInvalid();
        VOTE_NFT_IMPL = voteNFTImpl;
    }

    function createCandidate(DataTypes.CreateCandidateData calldata vars) external {
        if (_candidateExist(msg.sender)) revert Errors.CandidateExists();
        _validatehandle(vars.handle);

        _candidates[msg.sender].handle = vars.handle;
        _candidates[msg.sender].voteNFTURI = vars.voteNFTURI;

        emit Events.CandidateCreated(
            msg.sender,
            msg.sender,
            vars.handle,
            vars.voteNFTURI,
            block.timestamp
        );
    }

    function vote(address candidate) external returns (uint256) {
        if (!_candidateExist(candidate)) revert Errors.CandidateDoesNotExist();

        address voteNFT;
        uint256 tokenId;

        voteNFT = _candidates[candidate].voteNFT;

        if (voteNFT == address(0)) {
            voteNFT = _deployVoteNFT(candidate);
            _candidates[candidate].voteNFT = voteNFT;
        }

        tokenId = IVoteNFT(voteNFT).mint(msg.sender);

        emit Events.Voted(msg.sender, candidate, block.timestamp);
        return tokenId;
    }

    function getHandle(address candidate) external view returns (string memory) {
        if (!_candidateExist(candidate)) revert Errors.CandidateDoesNotExist();
        return _candidates[candidate].handle;
    }

    function getVoteNFT(address candidate) external view returns (address) {
        if (!_candidateExist(candidate)) revert Errors.CandidateDoesNotExist();
        return _candidates[candidate].voteNFT;
    }

    function getVoteNFTURI(address candidate) external view returns (string memory) {
        if (!_candidateExist(candidate)) revert Errors.CandidateDoesNotExist();
        return _candidates[candidate].voteNFTURI;
    }

    function emitVoteNFTTransferEvent(
        address candidate,
        uint256 voteNFTId,
        address from,
        address to
    ) external {
        address expecttedVoteNFT = _candidates[candidate].voteNFT;
        if (msg.sender != expecttedVoteNFT) revert Errors.CallerNotVoteNFT();
        emit Events.VoteNFTTransferred(candidate, voteNFTId, from, to, block.timestamp);
    }

    function getVotes(address candidate) external view returns (uint256) {
        if (!_candidateExist(candidate)) revert Errors.CandidateDoesNotExist();
        address voteNFT = _candidates[candidate].voteNFT;
        return IERC721Enumerable(voteNFT).totalSupply();
    }

    function getVoteNFTImpl() external view returns (address) {
        return VOTE_NFT_IMPL;
    }

    function _deployVoteNFT(address candidate) internal returns (address) {
        bytes memory functionData = abi.encodeWithSelector(IVoteNFT.initialize.selector, candidate);
        address voteNFT = address(new VoteNFTProxy(functionData));
        emit Events.VoteNFTDeployed(candidate, voteNFT, block.timestamp);

        return voteNFT;
    }

    function _candidateExist(address candidate) internal view returns (bool) {
        string memory handle = _candidates[candidate].handle;
        bytes memory bytesHandle = bytes(handle);
        if (bytesHandle.length == 0) return false;
        return true;
    }

    function _validatehandle(string calldata handle) internal pure {
        bytes memory bytesHandle = bytes(handle);
        if (bytesHandle.length == 0 || bytesHandle.length > Constants.MAX_HANDLE_LENGTH)
            revert Errors.HandleLengthInvalid();
    }
}
