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
    cover_image: {
      type: String,
    },
    details: {
      vehicle: { type: String },
      article: { type: String },
      difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'hard', 'extreme'],
      },
      vibe: { type: String },
      preparation: { type: String },
      scenery_quality: { type: Number, min: 1, max: 5 },
      cuisine_experience: { type: Number, min: 1, max: 5 },
      disadvantages: { type: String },
      duration_days: { type: Number },
      best_season: { type: String },
    },
  },
  { timestamps: true },
)

export default mongoose.models.Trip || mongoose.model('Trip', TripSchema)
