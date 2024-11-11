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
    publisher: { type: String, required: true }
  },
  duration: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  bids: [{
    bidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, required: true },
  }],
  messages: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    isPrivate: { type: Boolean, default: false },
    createdAt: { type: Date, required: true },
  }],
  startingPrice: { type: Number, required: true },
  reservePrice: { type: Number, required: true },
  status: { type: String, enum: ['waiting', 'active', 'succeded', `failed`, 'deleted'], default: 'waiting' },
}, { timestamps: true });

// excluding bids and messages by default
auctionSchema.path('bids').select(false);
auctionSchema.path('messages').select(false);

type Auction = InferSchemaType<typeof auctionSchema>;

export default mongoose.model<Auction>("Auction", auctionSchema);
