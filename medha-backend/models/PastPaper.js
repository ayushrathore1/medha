const mongoose = require("mongoose");

const PastPaperSchema = new mongoose.Schema(
  {
    university: {
      type: String,
      required: true,
      default: "RTU",
      trim: true,
      uppercase: true,
    },
    branch: {
      type: String,
      required: true,
      enum: ["CSE", "AIDS"],
      uppercase: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    subjectCode: {
      type: String,
      default: "",
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
      max: 2100,
    },
    examType: {
      type: String,
      enum: ["main", "back"],
      default: "main",
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    cloudinaryPublicId: {
      type: String,
      default: null,
    },
    sourceAttribution: {
      type: String,
      default: "Rajasthan Technical University (RTU)",
    },
    sourceUrl: {
      type: String,
      default: null,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

PastPaperSchema.index(
  {
    university: 1,
    branch: 1,
    semester: 1,
    subjectName: 1,
    year: 1,
    examType: 1,
  },
  { unique: true }
);

PastPaperSchema.index({ branch: 1, semester: 1, year: -1 });

module.exports = mongoose.model("PastPaper", PastPaperSchema);
