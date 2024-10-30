import cron from 'node-cron';

export const checkAuctions = cron.schedule('* * * * *', async () => {
  closeExpiredAuctionsAndSetWinner();
});

const closeExpiredAuctionsAndSetWinner = async () => {
  console.log('Checking auctions...');
}