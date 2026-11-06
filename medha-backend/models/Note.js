const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: false,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: false, // Made optional for new tag-based notes
    },
    subjectTag: {
      type: String,
      trim: true,
      default: null, // New field for subject tags
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    fileUrl: {
      type: String,
      default: null,
    },
    fileType: {
      type: String,
      default: null,
    },
    originalName: {
      type: String,
      default: null,
    },
    extractedText: {
      type: String,
      default: "",
    },
    flashcards: [
      {
        question: String,
        answer: String,
      },
    ],
    mcqs: [
      {
        question: String,
        options: [String],
        correctAnswer: String,
        explanation: String,
      },
    ],
    semester: {
      type: String,
      default: null, // "1st", "2nd", "3rd", "4th", etc.
      trim: true,
    },
    noteType: {
      type: String,
      default: null, // "📄 PYQ Paper", "📝 Handwritten Notes", "💻 Typed Notes", "📊 Diagrams"
      trim: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    verificationStatus: {
      type: String,
      // pending = AI queued/scanning; awaiting_team = AI passed; approved = live; rejected = failed
      enum: ["pending", "awaiting_team", "approved", "rejected"],
      default: "pending",
    },
    verificationReason: {
      type: String,
      default: "",
    },
    moderationLabel: {
      type: String,
      default: "",
    },
    pipelineStage: {
      type: String,
      enum: ["none", "queued", "compressing", "uploading", "scanning", "awaiting_team", "done", "failed"],
      default: "none",
    },
    scanAttempts: { type: Number, default: 0 },
    nextScanAt: { type: Date, default: null },
    scanLockUntil: { type: Date, default: null },
    cloudinaryPublicId: { type: String, default: null },
    compressedBytes: { type: Number, default: null },
    moderationCriteria: { type: Object, default: {} },
    moderationConfidence: { type: Number, default: null },
    teamReviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    teamReviewedAt: { type: Date, default: null },
    localFilePath: { type: String, default: null, select: false },
    emailsSent: {
      live: { type: Boolean, default: false },
      rejected: { type: Boolean, default: false },
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    downloadedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

NoteSchema.index({ owner: 1, createdAt: -1, _id: -1 });
NoteSchema.index({ isPublic: 1, verificationStatus: 1, createdAt: -1, _id: -1 });
NoteSchema.index({ isPublic: 1, subject: 1, createdAt: -1, _id: -1 });
NoteSchema.index({ isPublic: 1, semester: 1, createdAt: -1, _id: -1 });
NoteSchema.index({ isPublic: 1, subjectTag: 1, createdAt: -1, _id: -1 });

module.exports = mongoose.model("Note", NoteSchema);
