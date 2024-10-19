import mongoose, { InferSchemaType } from 'mongoose';

const auctionSchema = new mongoose.Schema({
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
  starting_price: { type: Number, required: true },
  reserve_price: { type: Number, required: true },
  highest_bid: { type: Number, required: true },
  status: { type: String, required: true },
  winner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  winning_bid: { type: Number }
}, { timestamps: true });

type Auction = InferSchemaType<typeof auctionSchema>;

export default mongoose.model<Auction>("Auction", auctionSchema);
