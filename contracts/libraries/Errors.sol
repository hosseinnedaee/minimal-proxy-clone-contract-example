// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

library Errors {
    error NotOwnerOrApproved();
    error Initialized();
    error InitParamsInvalid();
    error TokenDoesNotExist();
    error CallerNotVoteNFT();
    error CandidateExists();
    error HandleLengthInvalid();
    error CandidateDoesNotExist();
    error NotElection();
}
