import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IQuestionSolution extends Document {
  _id: Types.ObjectId;
  questionHash: string;
  questionText: string;
  subjectName: string;
  unitSerial?: number;
  unitName?: string;
  marks?: number;
  solution: string;
  mode: "quick" | "deep" | "fallback";
  analysis?: { questionType?: string; complexity?: string; keyTopics?: string[]; needsDiagram?: boolean; needsFormulas?: boolean; needsCode?: boolean; needsTable?: boolean; needsSteps?: boolean; estimatedWritingTime?: string; };
  feedback?: { overallScore?: number; strengths?: string[]; examinerTips?: string[]; };
  uiTemplate?: { template?: string; config?: unknown; };
  metadata?: { totalTime?: number; model?: string; layers?: unknown; };
  viewCount: number;
  lastAccessedAt: Date;
  generatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

interface IQuestionSolutionModel extends Model<IQuestionSolution> {
  createHash(questionText: string, subjectName: string, marks?: number): string;
}

const QuestionSolutionSchema = new Schema<IQuestionSolution>(
  {
    questionHash: { type: String, required: true, index: true },
    questionText: { type: String, required: true },
    subjectName: { type: String, required: true },
    unitSerial: Number,
    unitName: String,
    marks: Number,
    solution: { type: String, required: true },
    mode: { type: String, enum: ["quick", "deep", "fallback"], default: "deep" },
    analysis: { questionType: String, complexity: String, keyTopics: [String], needsDiagram: Boolean, needsFormulas: Boolean, needsCode: Boolean, needsTable: Boolean, needsSteps: Boolean, estimatedWritingTime: String },
    feedback: { overallScore: Number, strengths: [String], examinerTips: [String] },
    uiTemplate: { template: String, config: Schema.Types.Mixed },
    metadata: { totalTime: Number, model: String, layers: Schema.Types.Mixed },
    viewCount: { type: Number, default: 1 },
    lastAccessedAt: { type: Date, default: Date.now },
    generatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

QuestionSolutionSchema.index({ questionHash: 1, mode: 1 });

QuestionSolutionSchema.statics.createHash = function (questionText: string, subjectName: string, marks?: number): string {
  const normalized = questionText.toLowerCase().replace(/\s+/g, " ").replace(/<[^>]*>/g, "").trim();
  const combined = `${normalized}|${subjectName?.toLowerCase() || ""}|${marks || 0}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

const QuestionSolution =
  (mongoose.models.QuestionSolution as IQuestionSolutionModel) ||
  mongoose.model<IQuestionSolution, IQuestionSolutionModel>("QuestionSolution", QuestionSolutionSchema);

export default QuestionSolution;
