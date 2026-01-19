import mongoose from 'mongoose'

const ProvinceSchema = new mongoose.Schema(
  {
    name: String,
    code: Number,
  },
  { timestamps: false },
)

export default mongoose.models.Province ||
  mongoose.model('Province', ProvinceSchema)
