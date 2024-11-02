import cron from 'node-cron';
import auctionModel from '../models/auction.model';
import bidModel from '../models/bid.model';
import userModel from '../models/user.model';
// import { sendNotification } from '../services/notification.service';

export const checkAuctions = cron.schedule('* * * * *', async () => {
  console.log('Checking auctions...');
  closeExpiredAuctionsAndSetWinner();
  // startAuctionsIfNotStarted();
});

const closeExpiredAuctionsAndSetWinner = async () => {
  const now = new Date();

  // Find listings that have ended but are still active
  const expiredAuctions = await auctionModel.find({
    'duration.end': { $lte: now },
    status: "active",
  });

  for (const auction of expiredAuctions) {
    // Get the highest bid
    const highestBid = await bidModel.findOne({ auctionId: auction._id })
      .sort('-amount')
      .limit(1);

    if (highestBid && highestBid.amount >= auction.reservePrice) {
      // Auction successful

      const seller = await userModel.findById(auction.sellerId);
      const winner = await userModel.findById(highestBid.bidderId);

      if (seller && winner) {
        console.log(`Auction for ${auction.book?.title} selled by ${seller?.username} is won by ${winner?.username} at ${highestBid.amount}`);
        
        // await sendNotification(seller.email, 'Your auction has concluded successfully!');
        // await sendNotification(winner.email, 'You have won the auction!');
        
        // setting the winner in the auction
        auction.winnerId = winner._id;
        auction.winningBid = highestBid.amount;
      }

    } else {
      // Auction failed to meet reserve price
      console.log(`Auction for ${auction.book?.title} did not meet reserve price`);
    }

    auction.status = 'ended';
    await auction.save();
  }

}

// const startAuctionsIfNotStarted = async () => {
//   console.log('starting waiting auctions...');
// }