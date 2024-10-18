import mongoose, { InferSchemaType } from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'moderator'], required: true },
  name: { type: String },
  surname: { type: String },
  address: { type: String },
  temporary: { type: Boolean, default: false }
}, { timestamps: true });

type User = InferSchemaType<typeof userSchema>;

export default mongoose.model<User>("User", userSchema);
