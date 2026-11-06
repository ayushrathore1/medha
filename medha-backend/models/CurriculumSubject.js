const mongoose = require("mongoose");

const TopicResourceSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      enum: ["note", "youtube", "gfg", "link", "pdf"],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    // Sensitive — never returned on public curriculum reads
    url: { type: String, default: null, select: false },
    videoId: { type: String, default: null, select: false },
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: "Note", default: null },
    curatedResourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CuratedResource",
      default: null,
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const TopicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    resources: { type: [TopicResourceSchema], default: [] },
  },
  { timestamps: true }
);

const UnitSchema = new mongoose.Schema(
  {
    unitNumber: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, trim: true },
    topics: { type: [TopicSchema], default: [] },
  },
  { timestamps: true }
);

const CurriculumSubjectSchema = new mongoose.Schema(
  {
    semester: { type: Number, required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    short: { type: String, default: "" },
    scheme: { type: String, default: "rtu", trim: true },
    branch: { type: String, default: "CSE" },
    course: { type: String, default: "B.Tech" },
    active: { type: Boolean, default: true, index: true },
    units: { type: [UnitSchema], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

/* Same subject code can exist per branch within a semester (e.g. CSE vs ECE). */
CurriculumSubjectSchema.index({ semester: 1, branch: 1, code: 1 }, { unique: true });
CurriculumSubjectSchema.index({ semester: 1, branch: 1 });
CurriculumSubjectSchema.index({ name: "text", code: "text", short: "text" });

module.exports = mongoose.model("CurriculumSubject", CurriculumSubjectSchema);
