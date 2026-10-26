import mongoose, { Schema, Document, Model, Types } from "mongoose";

/* ─── Sub-schemas ─── */
interface IQuizQuestion { question: string; options: { A: string; B: string; C: string; D: string }; answer: "A" | "B" | "C" | "D"; }
interface IQuizAttempt { attemptDate: Date; answers: string[]; score: number; }

export interface IQuiz extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  note?: Types.ObjectId;
  subject?: string;
  topic?: string;
  questions: IQuizQuestion[];
  isAIGenerated: boolean;
  attempts: IQuizAttempt[];
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema({
  question: { type: String, required: true, trim: true },
  options: {
    A: { type: String, required: true, trim: true },
    B: { type: String, required: true, trim: true },
    C: { type: String, required: true, trim: true },
    D: { type: String, required: true, trim: true },
  },
  answer: { type: String, required: true, enum: ["A", "B", "C", "D"], uppercase: true },
});

const quizSchema = new Schema<IQuiz>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    note: { type: Schema.Types.ObjectId, ref: "Note", required: false, index: true },
    subject: { type: String, trim: true, index: true },
    topic: { type: String, trim: true, maxlength: 200 },
    questions: {
      type: [questionSchema],
      validate: { validator: (q: IQuizQuestion[]) => q && q.length > 0 && q.length <= 50, message: "Quiz must have between 1 and 50 questions" },
    },
    isAIGenerated: { type: Boolean, default: false },
    attempts: [{
      attemptDate: { type: Date, default: Date.now },
      answers: { type: [String] },
      score: { type: Number, min: 0, required: true },
    }],
  },
  { timestamps: true }
);

quizSchema.pre("save", function (next) {
  if (!this.note && !this.topic) return next(new Error("Quiz must have either a 'note' reference or a 'topic' string"));
  if (!this.note && (!this.topic || this.topic.trim().length === 0)) return next(new Error("Topic-based quiz must have a non-empty topic"));
  next();
});

quizSchema.index({ user: 1, createdAt: -1 });
quizSchema.index({ user: 1, subject: 1 });
quizSchema.index({ user: 1, note: 1 });

const Quiz: Model<IQuiz> = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", quizSchema);
export default Quiz;
