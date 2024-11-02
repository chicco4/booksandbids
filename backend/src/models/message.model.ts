import mongoose, { InferSchemaType } from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
  content: { type: String, required: true },
  isPublic: { type: Boolean, default: false },
}, { timestamps: true });

type Message = InferSchemaType<typeof messageSchema>;

export default mongoose.model<Message>("Message", messageSchema);
