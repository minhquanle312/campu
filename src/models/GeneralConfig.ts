import mongoose from 'mongoose'

const GeneralConfigAssetSchema = new mongoose.Schema(
  {
    fileId: { type: String, default: '' },
    url: { type: String, default: '' },
    name: { type: String, default: '' },
    filePath: { type: String, default: '' },
    width: { type: Number },
    height: { type: Number },
    thumbnailUrl: { type: String },
  },
  { _id: false },
)

const GeneralConfigDocumentGroupSchema = new mongoose.Schema(
  {
    id: { type: String, default: '' },
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    documentUrls: [{ type: String }],
  },
  { _id: false },
)

const GeneralConfigSchema = new mongoose.Schema(
  {
    homepage: {
      primaryImage: {
        type: GeneralConfigAssetSchema,
        default: null,
      },
      secondaryImage: {
        type: GeneralConfigAssetSchema,
        default: null,
      },
    },
    cv: {
      hrAssistantEnabled: { type: Boolean, default: true },
    },
    aiAssistant: {
      documentGroups: {
        type: [GeneralConfigDocumentGroupSchema],
        default: [],
      },
    },
  },
  { timestamps: true },
)

export default mongoose.models.GeneralConfig ||
  mongoose.model('GeneralConfig', GeneralConfigSchema)
