import { expect } from 'chai';
import { VoteNFT__factory } from '../typechain-types';
import { getTimestamp, matchEvent, waitForTx } from './helpers/utils';
import {
  candidateOne,
  candidateOneAddress,
  candidateThree,
  candidateTwo,
  candidateTwoAddress,
  deployer,
  election,
  makeSuitCleanRoom,
  MOCK_CANDIDATE_ONE_HANDLE,
  MOCK_CANDIDATE_ONE_VOTE_NFT_URI,
  MOCK_CANDIDATE_THREE_HANDLE,
  MOCK_CANDIDATE_THREE_VOTE_NFT_URI,
  MOCK_CANDIDATE_TWO_HANDLE,
  MOCK_CANDIDATE_TWO_VOTE_NFT_URI,
  voterOne,
  voterOneAddress,
  voterTwo,
  voterTwoAddress,
} from './__setup.spec';

makeSuitCleanRoom('Candidate Creation', function () {
  context('Generic', function () {
    beforeEach(async function () {
      await expect(
        election.connect(candidateOne).createCandidate({
          handle: MOCK_CANDIDATE_ONE_HANDLE,
          voteNFTURI: MOCK_CANDIDATE_ONE_VOTE_NFT_URI,
        })
      ).to.not.be.reverted;

      await expect(
        election.connect(candidateTwo).createCandidate({
          handle: MOCK_CANDIDATE_TWO_HANDLE,
          voteNFTURI: MOCK_CANDIDATE_TWO_VOTE_NFT_URI,
        })
      ).to.not.be.reverted;

      await expect(
        election.connect(candidateThree).createCandidate({
          handle: MOCK_CANDIDATE_THREE_HANDLE,
          voteNFTURI: MOCK_CANDIDATE_THREE_VOTE_NFT_URI,
        })
      ).to.not.be.reverted;
    });
    context('Negatives', function () {
      /* eslint-disable-line */
    });

    context('Scenarios', function () {
      it('VoterOne can vote CandidateTwo, so as the result it should mint a voteNFT of candidateOne to voterOne', async function () {
        const receipt = await waitForTx(election.connect(voterOne).vote(candidateTwoAddress));

        const voteNFT = await election.getVoteNFT(candidateTwoAddress);

        matchEvent(receipt, 'Voted', [voterOneAddress, candidateTwoAddress, await getTimestamp()]);
        matchEvent(receipt, 'VoteNFTDeployed', [
          candidateTwoAddress,
          voteNFT,
          await getTimestamp(),
        ]);

        const votesCount = await election.getVotes(candidateTwoAddress);
        expect(votesCount).to.eq(1);
      });

      it('VoterOne should be able to vote candidateOne and candidateTwo, so as the result it should mint a voteNFT of each candidate', async function () {
        const receiptOne = await waitForTx(election.connect(voterOne).vote(candidateOneAddress));

        const voteNFTCandidateOneAddr = await election.getVoteNFT(candidateOneAddress);

        matchEvent(receiptOne, 'Voted', [
          voterOneAddress,
          candidateOneAddress,
          await getTimestamp(),
        ]);
        matchEvent(receiptOne, 'VoteNFTDeployed', [
          candidateOneAddress,
          voteNFTCandidateOneAddr,
          await getTimestamp(),
        ]);

        const votesCountCandidateOne = await election.getVotes(candidateOneAddress);
        expect(votesCountCandidateOne).to.eq(1);

        const receiptTwo = await waitForTx(election.connect(voterOne).vote(candidateTwoAddress));

        const voteNFTCandidateTwoAddr = await election.getVoteNFT(candidateTwoAddress);

        expect(voteNFTCandidateTwoAddr).to.not.eq(voteNFTCandidateOneAddr);

        matchEvent(receiptTwo, 'Voted', [
          voterOneAddress,
          candidateTwoAddress,
          await getTimestamp(),
        ]);
        matchEvent(receiptTwo, 'VoteNFTDeployed', [
          candidateTwoAddress,
          voteNFTCandidateTwoAddr,
          await getTimestamp(),
        ]);

        const votesCountCandidateTwo = await election.getVotes(candidateTwoAddress);
        expect(votesCountCandidateTwo).to.eq(1);
      });

      it('VoterOne and VoterTwo should be able to vote candidateOne, so as the result it should mint an voteNFT of candidateOne to each voter', async function () {
        await expect(election.connect(voterOne).vote(candidateOneAddress)).to.be.not.reverted;
        await expect(election.connect(voterTwo).vote(candidateOneAddress)).to.be.not.reverted;

        const votesCountCandidateOne = await election.getVotes(candidateOneAddress);
        expect(votesCountCandidateOne).to.eq(2);

        const candidateOneVoteNFTAddr = await election.getVoteNFT(candidateOneAddress);

        const voteNFTCandidateOne = VoteNFT__factory.connect(candidateOneVoteNFTAddr, deployer);

        const voterOneNFTBalance = await voteNFTCandidateOne.balanceOf(voterOneAddress);
        const voterTwoNFTBalance = await voteNFTCandidateOne.balanceOf(voterTwoAddress);

        expect(voterOneNFTBalance).to.eq(1);
        expect(voterTwoNFTBalance).to.eq(1);
      });
    });
  });
});
