import mongoose, { InferSchemaType } from 'mongoose';

const auctionSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: {
    title: { type: String, required: true },
    author: { type: String, required: true },
    ISBN: { type: String, required: true },
    course: { type: String, required: true },
    university: { type: String, required: true },
    edition: { type: String, required: true },
    publisher: { type: String, required: true },
  },
  duration: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  startingPrice: { type: Number, required: true },
  reservePrice: { type: Number, required: true },
  highestBid: { type: Number },
  status: { type: String, enum: ['waiting', 'active', 'ended', 'deleted'] },
  winnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  winningBid: { type: Number }
}, { timestamps: true });

type Auction = InferSchemaType<typeof auctionSchema>;

export default mongoose.model<Auction>("Auction", auctionSchema);
