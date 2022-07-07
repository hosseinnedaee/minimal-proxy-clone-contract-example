import { use } from 'chai';
import { solidity } from 'ethereum-waffle';
import { computeContractAddress, revertToSnapshot, takeSnapshot } from './helpers/utils';
import { Signer } from 'ethers';
import { ethers } from 'hardhat';
import {
  Election,
  Election__factory,
  Events,
  Events__factory,
  VoteNFT,
  VoteNFT__factory,
} from '../typechain-types';

use(solidity);

export let eventsLib: Events;
export let accounts: Signer[];
export let deployer: Signer;
export let candidateOne: Signer;
export let candidateTwo: Signer;
export let candidateThree: Signer;
export let deployerAddress: string;
export let candidateOneAddress: string;
export let candidateTwoAddress: string;
export let candidateThreeAddress: string;
export let voterOne: Signer;
export let voterTwo: Signer;
export let voterThree: Signer;
export let voterOneAddress: string;
export let voterTwoAddress: string;
export let voterThreeAddress: string;
export let voteNFTImpl: VoteNFT;
export let election: Election;

export const MOCK_CANDIDATE_ONE_HANDLE = 'Ali';
export const MOCK_CANDIDATE_ONE_VOTE_NFT_URI = 'ipfs://ALI_VOTE_NFT_URI_IPFS_HASH/';
export const MOCK_CANDIDATE_TWO_HANDLE = 'Reza';
export const MOCK_CANDIDATE_TWO_VOTE_NFT_URI = 'ipfs://REZA_VOTE_NFT_URI_IPFS_HASH/';
export const MOCK_CANDIDATE_THREE_HANDLE = 'Ahmad';
export const MOCK_CANDIDATE_THREE_VOTE_NFT_URI = 'ipfs://AHMAD_VOTE_NFT_URI_IPFS_HASH/';

export async function makeSuitCleanRoom(name: string, tests: () => void) {
  describe(name, function () {
    beforeEach(async function () {
      await takeSnapshot();
    });
    tests();
    afterEach(async function () {
      await revertToSnapshot();
    });
  });
}

before(async function () {
  accounts = await ethers.getSigners();
  deployer = accounts[0];
  candidateOne = accounts[1];
  candidateTwo = accounts[2];
  candidateThree = accounts[3];
  voterOne = accounts[4];
  voterTwo = accounts[5];
  voterThree = accounts[6];
  deployerAddress = await deployer.getAddress();
  candidateOneAddress = await candidateOne.getAddress();
  candidateTwoAddress = await candidateTwo.getAddress();
  candidateThreeAddress = await candidateThree.getAddress();
  voterOneAddress = await voterOne.getAddress();
  voterTwoAddress = await voterTwo.getAddress();
  voterThreeAddress = await voterThree.getAddress();

  const nonce = await deployer.getTransactionCount();
  // nonce + 0 is vote NFT Impl
  // nonce + 1 is election

  const electionAddress = computeContractAddress(deployerAddress, nonce + 1);

  voteNFTImpl = await new VoteNFT__factory(deployer).deploy(electionAddress);

  election = await new Election__factory(deployer).deploy(voteNFTImpl.address);

  // Event library deployment is only needed for testing and is not reproduced in the live environment
  eventsLib = await new Events__factory(deployer).deploy();
});
