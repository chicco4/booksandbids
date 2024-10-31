import cron from 'node-cron';
import auctions from '../models/auction.model';
import bids from '../models/bid.model';
// import users from '../models/user.model'; // mi serve per notificare il vincitore dell'asta

export const checkAuctions = cron.schedule('* * * * *', async () => {
  console.log('Checking auctions...');
  closeExpiredAuctionsAndSetWinner();
});

const closeExpiredAuctionsAndSetWinner = async () => {
  const now = new Date();

  // Find listings that have ended but are still active
  const expiredAuctions = await auctions.find({
    endDate: { $lte: now },
    isActive: true,
  });

  for (const auction of expiredAuctions) {
    // Get the highest bid
    const highestBid = await bids.findOne({ auction_id: auction._id })
      .sort('-amount')
      .limit(1);

    if (highestBid && highestBid.amount >= auction.reserve_price) {
      // Auction successful

      // Notify seller and winner (implement notification logic)
      console.log(`Auction won by ${highestBid.bidder_id}`);

    } else {

      // Auction failed to meet reserve price
      console.log(`Auction for ${auction.book?.title} did not meet reserve price`);
    }

    // Mark listing as inactive
    auction.status = 'ended';
    await auction.save();
  }

}