import mongoose, { InferSchemaType } from 'mongoose';

const messageSchema = new mongoose.Schema({
    auction_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    is_public: { type: Boolean, default: false },
}, { timestamps: true });

type Message = InferSchemaType<typeof messageSchema>;

export default mongoose.model<Message>("User", messageSchema);
