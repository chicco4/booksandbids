import mongoose, { InferSchemaType } from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'moderator'], required: true },
  name: { type: String },
  surname: { type: String },
  address: { type: String },
  mod_invited_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mod_first_login: { type: Boolean, default: false },
  mod_temporary_password: { type: String }
}, { timestamps: true });

type User = InferSchemaType<typeof userSchema>;

export default mongoose.model<User>("User", userSchema);
