import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface ITestCase { input: string; expectedOutput: string; isHidden: boolean; description: string; }
interface IPyqInfo { year?: number; examDate?: string; paperCode?: string; part?: "A" | "B" | "C"; questionNumber?: number; marks?: number; }

export interface IPracticeQuestion extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  tags: string[];
  language: "cpp" | "c";
  starterCode: string;
  solutionCode: string;
  testCases: ITestCase[];
  hints: string[];
  explanation: string;
  pyqInfo?: IPyqInfo;
  chatgptSolutionLink?: string;
  concepts: string[];
  order: number;
  totalAttempts: number;
  successfulAttempts: number;
  isActive: boolean;
  createdBy?: Types.ObjectId;
  successRate: number;
  createdAt: Date;
  updatedAt: Date;
}

const practiceQuestionSchema = new Schema<IPracticeQuestion>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    category: {
      type: String,
      enum: ["classes-objects", "inheritance", "polymorphism", "encapsulation", "abstraction", "constructors-destructors", "operator-overloading", "templates", "exception-handling", "file-handling", "stl", "pointers", "basic-syntax", "arrays-strings", "functions", "other"],
      required: true,
    },
    tags: [{ type: String, trim: true }],
    language: { type: String, enum: ["cpp", "c"], default: "cpp" },
    starterCode: { type: String, required: true },
    solutionCode: { type: String, required: true },
    testCases: [{ input: { type: String, default: "" }, expectedOutput: { type: String, required: true }, isHidden: { type: Boolean, default: false }, description: { type: String, default: "" } }],
    hints: [{ type: String }],
    explanation: { type: String, default: "" },
    pyqInfo: {
      year: Number, examDate: String, paperCode: String,
      part: { type: String, enum: ["A", "B", "C"] },
      questionNumber: Number, marks: Number,
    },
    chatgptSolutionLink: { type: String, trim: true },
    concepts: [{ type: String }],
    order: { type: Number, default: 0 },
    totalAttempts: { type: Number, default: 0 },
    successfulAttempts: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

practiceQuestionSchema.index({ category: 1, difficulty: 1, isActive: 1 });
practiceQuestionSchema.index({ language: 1, isActive: 1 });
practiceQuestionSchema.index({ order: 1 });

practiceQuestionSchema.virtual("successRate").get(function () {
  if (this.totalAttempts === 0) return 0;
  return Math.round((this.successfulAttempts / this.totalAttempts) * 100);
});

practiceQuestionSchema.set("toJSON", { virtuals: true });
practiceQuestionSchema.set("toObject", { virtuals: true });

const PracticeQuestion: Model<IPracticeQuestion> =
  mongoose.models.PracticeQuestion || mongoose.model<IPracticeQuestion>("PracticeQuestion", practiceQuestionSchema);

export default PracticeQuestion;
