import mongoose, { Schema, Document, Model, Types } from "mongoose";

/* ─── Interfaces ─── */
interface IFlashcardEmbed { question: string; answer: string; }
interface IMcqEmbed { question: string; options: string[]; correctAnswer: string; explanation: string; }

export interface INote extends Document {
  _id: Types.ObjectId;
  title: string;
  content?: string;
  subject?: Types.ObjectId;
  subjectTag?: string | null;
  owner: Types.ObjectId;
  isPublic: boolean;
  fileUrl?: string | null;
  fileType?: string | null;
  originalName?: string | null;
  extractedText: string;
  flashcards: IFlashcardEmbed[];
  mcqs: IMcqEmbed[];
  semester?: string | null;
  noteType?: string | null;
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: false },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: false },
    subjectTag: { type: String, trim: true, default: null },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isPublic: { type: Boolean, default: false },
    fileUrl: { type: String, default: null },
    fileType: { type: String, default: null },
    originalName: { type: String, default: null },
    extractedText: { type: String, default: "" },
    flashcards: [{ question: String, answer: String }],
    mcqs: [{ question: String, options: [String], correctAnswer: String, explanation: String }],
    semester: { type: String, default: null, trim: true },
    noteType: { type: String, default: null, trim: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);

export default Note;
