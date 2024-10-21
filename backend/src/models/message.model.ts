import mongoose, { InferSchemaType } from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  auction_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
  content: { type: String, required: true },
  is_public: { type: Boolean, default: false },
}, { timestamps: true });

type Message = InferSchemaType<typeof messageSchema>;

export default mongoose.model<Message>("Message", messageSchema);
