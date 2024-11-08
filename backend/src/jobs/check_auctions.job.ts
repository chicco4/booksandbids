import cron from 'node-cron';
import auctionModel from '../models/auction.model';
import userModel from '../models/user.model';

export const checkAuctions = cron.schedule('* * * * *', async () => {
  console.log('Checking auctions...');
  startWaitingAuctions();
  closeExpiredAuctionsAndSetWinner();
});

const startWaitingAuctions = async () => {
  console.log('starting waiting auctions...');

  const now = new Date();

  // Find listings that have ended but are still active
  const waitingAuctions = await auctionModel.find({
    'duration.start': { $lte: now },
    status: "waiting",
  });

  // Set the status of the auctions to active
  for (const auction of waitingAuctions) {
    console.log(`Auction for ${auction.book?.title} is now active`);
    auction.status = 'active';
    await auction.save();
  }
};

const closeExpiredAuctionsAndSetWinner = async () => {
  console.log('closing expired auctions...');

  const now = new Date();

  // Find listings that have ended but are still active
  const expiredAuctions = await auctionModel.find({
    'duration.end': { $lte: now },
    status: "active",
  });

  for (const auction of expiredAuctions) {
    // Get the highest bid
    const highestBid = auction.bids.reduce((max, bid) =>
      bid.amount > max.amount ? bid : max,
      auction.bids[0]
    );

    if (highestBid && highestBid.amount >= auction.reservePrice) {
      // Auction successful
      const seller = await userModel.findById(auction.sellerId);
      const winner = await userModel.findById(highestBid.bidderId);

      if (seller && winner) {
        console.log(`Auction for ${auction.book?.title} selled by ${seller?.username} is won by ${winner?.username} at ${highestBid.amount}`);
        auction.status = 'succeded';

      } else {
        console.log(`Auction for ${auction.book?.title} has invalid seller or winner`);
        auction.status = 'failed';

      }

    } else {
      // Auction failed to meet reserve price
      console.log(`Auction for ${auction.book?.title} did not meet reserve price`);
      auction.status = 'failed';

    }

    await auction.save();
  }
};