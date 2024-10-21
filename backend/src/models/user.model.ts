import mongoose, { InferSchemaType } from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String },
  surname: { type: String },
  address: { type: String },
  is_moderator: { type: Boolean, default: false },
  is_first_login: { type: Boolean, default: false },
  invited_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  temporary_password: { type: String }
}, { timestamps: true });

type User = InferSchemaType<typeof userSchema>;

export default mongoose.model<User>("User", userSchema);
