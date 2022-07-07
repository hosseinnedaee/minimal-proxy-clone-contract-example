# Minimal Proxy Clone Contract Example (EIP-1167)

This is an election example, you can add any wallet address as candidates. then users can vote them.<br />

Voting work based on NFT. When a user votes a candidate a NFT mints to the user from VoteNFT collection of that candidate.<br/>

We used minimal proxy clone to clone and deploy an VoteNFT for each candidate. There is a deployed VoteNFT implementation. a proxy of that will deployed for candidate on first vote for that condidate.<br/>

When you vote a candidate actually you are minting an NFT on that candidate VoteNFT collection.

---

How to install:

```bash
yarn
```

Read the `tests` and run it with:
```bash
yarn test
```