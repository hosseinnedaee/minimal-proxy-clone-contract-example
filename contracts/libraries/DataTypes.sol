// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

library DataTypes {
    struct CandidateStruct {
        string handle;
        address voteNFT;
        string voteNFTURI;
    }

    struct CreateCandidateData {
        string handle;
        string voteNFTURI;
    }
}
