import mongoose, { InferSchemaType } from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
}, { timestamps: true });

type User = InferSchemaType<typeof userSchema>;

export default mongoose.model<User>("User", userSchema);
