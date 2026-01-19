import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: false },
    avatar_url: { type: String, required: false },
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model('User', UserSchema)
