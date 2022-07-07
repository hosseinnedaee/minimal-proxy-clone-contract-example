// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import {DataTypes} from '../libraries/DataTypes.sol';

interface IVoteNFT {
    function initialize(address candidate) external;

    function mint(address to) external returns (uint256);
}
