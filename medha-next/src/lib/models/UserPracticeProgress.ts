import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface IAttempt { code: string; output: string; isCorrect: boolean; executionTime: number; attemptedAt: Date; }

export interface IUserPracticeProgress extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  question: Types.ObjectId;
  status: "not-started" | "attempted" | "solved";
  lastSubmittedCode: string;
  attempts: IAttempt[];
  totalAttempts: number;
  timeSpent: number;
  firstSolvedAt?: Date;
  hintsUsed: number;
  viewedSolution: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userPracticeProgressSchema = new Schema<IUserPracticeProgress>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "PracticeQuestion", required: true },
    status: { type: String, enum: ["not-started", "attempted", "solved"], default: "not-started" },
    lastSubmittedCode: { type: String, default: "" },
    attempts: [{ code: String, output: String, isCorrect: Boolean, executionTime: Number, attemptedAt: { type: Date, default: Date.now } }],
    totalAttempts: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 },
    firstSolvedAt: { type: Date },
    hintsUsed: { type: Number, default: 0 },
    viewedSolution: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userPracticeProgressSchema.index({ user: 1, question: 1 }, { unique: true });
userPracticeProgressSchema.index({ user: 1, status: 1 });

const UserPracticeProgress: Model<IUserPracticeProgress> =
  mongoose.models.UserPracticeProgress || mongoose.model<IUserPracticeProgress>("UserPracticeProgress", userPracticeProgressSchema);

export default UserPracticeProgress;
