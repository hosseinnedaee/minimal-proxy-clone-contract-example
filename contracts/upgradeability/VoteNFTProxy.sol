// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import '@openzeppelin/contracts/proxy/Proxy.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import {IElection} from '../interfaces/IElection.sol';

contract VoteNFTProxy is Proxy {
    using Address for address;
    address private immutable ELECTION;

    constructor(bytes memory data) {
        ELECTION = msg.sender;
        IElection(ELECTION).getVoteNFTImpl().functionDelegateCall(data);
    }

    function _implementation() internal view override returns (address) {
        return IElection(ELECTION).getVoteNFTImpl();
    }
}
