import mongoose from 'mongoose'

const TripCostSchema = new mongoose.Schema(
  {
    trip_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['transport', 'food', 'accommodation', 'activity', 'other'],
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'VND',
    },
    note: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.models.TripCost ||
  mongoose.model('TripCost', TripCostSchema)
