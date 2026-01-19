import mongoose from 'mongoose'

const TripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    province_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Province',
      required: true,
    },
    participant_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    videos: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Trip || mongoose.model('Trip', TripSchema)
