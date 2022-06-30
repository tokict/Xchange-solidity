# Example Marketplace Project (Solidity, Rust (Near))

This project demonstrates how a marketplace could be implemented in Solidity and Rust (Near).

It is a fully working and usable piece of software but with basic features. Due to feature parity between languages and because Solidity is not fit for projects like this, the Rust part is also made feature scarce.

The project comes with everything ready to go and just needs deploying via scripts and it's ready for use or to be a template for your project. You can set up your own fees and margin rules




# What does it do?
This marketplace enables buyers and sellers to put up BIDs and ASKs for specific resources (in this case, minerals or gases) within an arbitrary submission period.

The Bids and ASKs are visible to all and everyone can update theirs.

Once the submission period is done, we calculate the median price and open trading period.

In trading period, the buyers send trade offers to sellers based on median price, but specifiying quantity.

If the offer is accepted by seller, the buyer needs to pay the amount into an escrow account.

Once delivery has been made, the escrow calls a payout function and pays seller.

N.B: If the buyer puts up a very high price, not in line with other buyers, he needs to put up a margin. If he has bid with a high price and the median price is lower than his bid and there are enough quantities, he needs to make an offer. If he does not make an offer or pay an accepted offer, he loses his paid margin as penalty. This is to prevent price manipulation via ake hihg bids.
# Contents
- ***./solidity*** *(Standalone hardhat project with all ready to go for deployment, including tests)*
- ***./rust*** *(Same like solidity dir but in Rust)*


### The basic contract flow looks like this:

<img src="https://static.swimlanes.io/6b89a563edb664dade74e99ea0109761.png"/>

### A bit more detailed Seller flow:


<img src="https://static.swimlanes.io/ebda7711da0c2deee5a91923e34433d2.png"/>

### And buyer flow:
<img src="https://static.swimlanes.io/b695016110763e8d81cf64f06399f85d.png"/>