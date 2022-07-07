// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import {DataTypes} from './libraries/DataTypes.sol';

abstract contract ElectionStorage {
    mapping(address => DataTypes.CandidateStruct) internal _candidates;
}
