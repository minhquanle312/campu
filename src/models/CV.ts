import mongoose from 'mongoose'

const CVSchema = new mongoose.Schema(
  {
    personalInfo: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      address: {
        vi: { type: String, default: '' },
        en: { type: String, default: '' },
      },
      birthYear: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    summary: {
      vi: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    objective: {
      vi: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    education: [
      {
        institution: {
          vi: { type: String, default: '' },
          en: { type: String, default: '' },
        },
        major: {
          vi: { type: String, default: '' },
          en: { type: String, default: '' },
        },
        period: { type: String, default: '' },
      },
    ],
    skills: {
      vi: [{ type: String }],
      en: [{ type: String }],
    },
    experience: [
      {
        company: { type: String, default: '' },
        role: {
          vi: { type: String, default: '' },
          en: { type: String, default: '' },
        },
        period: {
          vi: { type: String, default: '' },
          en: { type: String, default: '' },
        },
        descriptions: {
          vi: [{ type: String }],
          en: [{ type: String }],
        },
      },
    ],
  },
  { timestamps: true },
)

export default mongoose.models.CV || mongoose.model('CV', CVSchema)
