import {
  candidateOne,
  candidateOneAddress,
  candidateThree,
  candidateThreeAddress,
  candidateTwo,
  candidateTwoAddress,
  election,
  makeSuitCleanRoom,
  MOCK_CANDIDATE_ONE_HANDLE,
  MOCK_CANDIDATE_ONE_VOTE_NFT_URI,
  MOCK_CANDIDATE_THREE_HANDLE,
  MOCK_CANDIDATE_THREE_VOTE_NFT_URI,
  MOCK_CANDIDATE_TWO_HANDLE,
  MOCK_CANDIDATE_TWO_VOTE_NFT_URI,
} from './__setup.spec';
import { expect } from 'chai';
import { getTimestamp, matchEvent, waitForTx } from './helpers/utils';

makeSuitCleanRoom('Candidate Creation', function () {
  context('Generic', function () {
    context('Negatives', function () {
      it('CandidateOne cant create candidate more than one', async function () {
        await expect(
          election.connect(candidateOne).createCandidate({
            handle: 'Ali',
            voteNFTURI: 'ipfs://ALI_VOTE_NFT_URI_IPFS_HASH/',
          })
        ).to.not.be.reverted;

        await expect(
          election.connect(candidateOne).createCandidate({
            handle: 'Ali',
            voteNFTURI: 'ipfs://ALI_VOTE_NFT_URI_IPFS_HASH/',
          })
        ).to.be.revertedWith('CandidateExists()');
      });
    });

    context('Scenarios', function () {
      it('CandidateOne should able to create candidate, same for CandidateTwo and CandidateThree', async function () {
        const receiptOne = await waitForTx(
          election.connect(candidateOne).createCandidate({
            handle: MOCK_CANDIDATE_ONE_HANDLE,
            voteNFTURI: MOCK_CANDIDATE_ONE_VOTE_NFT_URI,
          })
        );
        matchEvent(receiptOne, 'CandidateCreated', [
          candidateOneAddress,
          candidateOneAddress,
          MOCK_CANDIDATE_ONE_HANDLE,
          MOCK_CANDIDATE_ONE_VOTE_NFT_URI,
          await getTimestamp(),
        ]);
        const candidateOneHandle = await election.getHandle(candidateOneAddress);
        const candidateOneVoteNFTURI = await election.getVoteNFTURI(candidateOneAddress);
        expect(candidateOneHandle).to.eq(MOCK_CANDIDATE_ONE_HANDLE);
        expect(candidateOneVoteNFTURI).to.eq(MOCK_CANDIDATE_ONE_VOTE_NFT_URI);

        const receiptTwo = await waitForTx(
          election.connect(candidateTwo).createCandidate({
            handle: MOCK_CANDIDATE_TWO_HANDLE,
            voteNFTURI: MOCK_CANDIDATE_TWO_VOTE_NFT_URI,
          })
        );
        matchEvent(receiptTwo, 'CandidateCreated', [
          candidateTwoAddress,
          candidateTwoAddress,
          MOCK_CANDIDATE_TWO_HANDLE,
          MOCK_CANDIDATE_TWO_VOTE_NFT_URI,
          await getTimestamp(),
        ]);
        const candidateTwoHandle = await election.getHandle(candidateTwoAddress);
        const candidateTwoVoteNFTURI = await election.getVoteNFTURI(candidateTwoAddress);
        expect(candidateTwoHandle).to.eq(MOCK_CANDIDATE_TWO_HANDLE);
        expect(candidateTwoVoteNFTURI).to.eq(MOCK_CANDIDATE_TWO_VOTE_NFT_URI);

        const receiptThree = await waitForTx(
          election.connect(candidateThree).createCandidate({
            handle: MOCK_CANDIDATE_THREE_HANDLE,
            voteNFTURI: MOCK_CANDIDATE_THREE_VOTE_NFT_URI,
          })
        );
        matchEvent(receiptThree, 'CandidateCreated', [
          candidateThreeAddress,
          candidateThreeAddress,
          MOCK_CANDIDATE_THREE_HANDLE,
          MOCK_CANDIDATE_THREE_VOTE_NFT_URI,
          await getTimestamp(),
        ]);
        const candidateThreeHandle = await election.getHandle(candidateThreeAddress);
        const candidateThreeVoteNFTURI = await election.getVoteNFTURI(candidateThreeAddress);
        expect(candidateThreeHandle).to.eq(MOCK_CANDIDATE_THREE_HANDLE);
        expect(candidateThreeVoteNFTURI).to.eq(MOCK_CANDIDATE_THREE_VOTE_NFT_URI);
      });
    });
  });
});
