// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import {NFTBase} from './base/NFTBase.sol';
import {Errors} from './libraries/Errors.sol';
import {Events} from './libraries/Events.sol';
import {Constants} from './libraries/Constants.sol';
import {IElection} from './interfaces/IElection.sol';
import {IVoteNFT} from './interfaces/IVoteNFT.sol';

contract VoteNFT is NFTBase, IVoteNFT {
    address private immutable ELECTION;

    address internal _candidate;
    uint256 internal _tokenIdCounter;

    bool private _initialized;

    constructor(address election) {
        if (election == address(0)) revert Errors.InitParamsInvalid();
        ELECTION = election;
        _initialized = true;
    }

    function initialize(address candidate) external {
        if (_initialized) revert Errors.Initialized();
        _initialized = true;
        _candidate = candidate;
        emit Events.VoteNFTInitialized(candidate, block.timestamp);
    }

    function name() public view override returns (string memory) {
        string memory handle = IElection(ELECTION).getHandle(_candidate);
        return string(abi.encodePacked(handle, Constants.VOTE_NFT_NAME_SUFFIX));
    }

    function symbol() public view override returns (string memory) {
        string memory handle = IElection(ELECTION).getHandle(_candidate);
        return string(abi.encodePacked(handle, Constants.VOTE_NFT_SYMBOL_SUFFIX));
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) revert Errors.TokenDoesNotExist();
        return IElection(ELECTION).getVoteNFTURI(_candidate);
    }

    function mint(address to) external returns (uint256) {
        if (msg.sender != ELECTION) revert Errors.NotElection();
        unchecked {
            uint256 tokenId = ++_tokenIdCounter;
            _mint(to, tokenId);
            return tokenId;
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId);
        IElection(ELECTION).emitVoteNFTTransferEvent(_candidate, tokenId, from, to);
    }
}
