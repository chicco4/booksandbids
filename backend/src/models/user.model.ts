import mongoose, { InferSchemaType } from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  name: { type: String, select: false },
  surname: { type: String, select: false },
  address: { type: String, select: false },
  isModerator: { type: Boolean, default: false },
  isFirstLogin: { type: Boolean },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

type User = InferSchemaType<typeof userSchema>;

export default mongoose.model<User>("User", userSchema);
