// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import './ERC721Enumerable.sol';
import {Errors} from '../libraries/Errors.sol';

abstract contract NFTBase is ERC721Enumerable {
    function burn(uint256 tokenId) public {
        if (!_isApprovedOrOwner(msg.sender, tokenId)) revert Errors.NotOwnerOrApproved();
        _burn(tokenId);
    }
}
