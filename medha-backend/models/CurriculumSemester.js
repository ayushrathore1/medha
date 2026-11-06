const mongoose = require("mongoose");

const CurriculumSemesterSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 12,
    },
    /** Year of study (1–4). Defaults from semester number: 1–2→Y1, 3–4→Y2, … */
    year: {
      type: Number,
      min: 1,
      max: 4,
      index: true,
    },
    label: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    active: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

CurriculumSemesterSchema.pre("validate", function deriveYear(next) {
  if (this.year == null && this.number != null) {
    this.year = Math.min(4, Math.max(1, Math.ceil(Number(this.number) / 2)));
  }
  next();
});

module.exports = mongoose.model("CurriculumSemester", CurriculumSemesterSchema);
