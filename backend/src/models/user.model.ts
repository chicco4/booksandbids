import mongoose, { InferSchemaType } from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  name: { type: String, select: false },
  surname: { type: String, select: false },
  address: { type: String, select: false },
  is_moderator: { type: Boolean, default: false },
  is_first_login: { type: Boolean },
  invited_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  temporary_password: { type: String }
}, { timestamps: true });

type User = InferSchemaType<typeof userSchema>;

export default mongoose.model<User>("User", userSchema);
