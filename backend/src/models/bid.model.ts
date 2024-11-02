import mongoose, { InferSchemaType } from 'mongoose';

const bidSchema = new mongoose.Schema({
  auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
  bidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
}, { timestamps: true });

type Bid = InferSchemaType<typeof bidSchema>;

export default mongoose.model<Bid>("Bid", bidSchema);
