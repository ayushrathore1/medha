import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface IExamQuestion { qCode: string; marks: number; text: string; topic?: string | null; imageUrl?: string | null; imageFileId?: string | null; chatgptLink?: string | null; claudeLink?: string | null; }
interface IExamUnit { unitSerial: number; unitName: string; totalMarks: number; youtubePlaylistUrl?: string | null; questions: IExamQuestion[]; }
interface IYearData { year: number; units: IExamUnit[]; }

export interface IExamAnalysis extends Document {
  _id: Types.ObjectId;
  subjectName: string;
  totalPaperMarks: number;
  years: IYearData[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema({
  qCode: { type: String, required: true },
  marks: { type: Number, required: true },
  text: { type: String, required: true },
  topic: { type: String, default: null },
  imageUrl: { type: String, default: null },
  imageFileId: { type: String, default: null },
  chatgptLink: { type: String, default: null },
  claudeLink: { type: String, default: null },
});

const UnitSchema = new Schema({
  unitSerial: { type: Number, required: true },
  unitName: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  youtubePlaylistUrl: { type: String, default: null },
  questions: [QuestionSchema],
});

const YearDataSchema = new Schema({ year: { type: Number, required: true }, units: [UnitSchema] });

const ExamAnalysisSchema = new Schema<IExamAnalysis>(
  { subjectName: { type: String, required: true, unique: true }, totalPaperMarks: { type: Number, required: true }, years: [YearDataSchema] },
  { timestamps: true }
);

const ExamAnalysis: Model<IExamAnalysis> =
  mongoose.models.ExamAnalysis || mongoose.model<IExamAnalysis>("ExamAnalysis", ExamAnalysisSchema);

export default ExamAnalysis;
