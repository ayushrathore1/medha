import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IFlashcard extends Document {
  _id: Types.ObjectId;
  note?: Types.ObjectId;
  question: string;
  answer: string;
  owner: Types.ObjectId;
  subject: string;
  topicName: string;
  isAIGenerated: boolean;
  difficulty: "easy" | "medium" | "hard";
  viewed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FlashcardSchema = new Schema<IFlashcard>(
  {
    note: { type: Schema.Types.ObjectId, ref: "Note", required: false },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true, trim: true },
    topicName: { type: String, required: true, trim: true },
    isAIGenerated: { type: Boolean, default: false },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    viewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Flashcard: Model<IFlashcard> =
  mongoose.models.Flashcard || mongoose.model<IFlashcard>("Flashcard", FlashcardSchema);

export default Flashcard;
