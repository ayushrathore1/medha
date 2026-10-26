import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUniversitySyllabus extends Document {
  _id: Types.ObjectId; university: string; branch: string; semester: number;
  subjects: Array<{ name: string; code: string; units: Array<{ unitNumber: number; title: string; topics: string[]; hours: number; }>; }>;
  uploadedBy: Types.ObjectId[]; originalFileUrls: string[]; lastUpdatedBy?: Types.ObjectId;
  status: "processing" | "ready" | "failed"; errorMessage: string;
  createdAt: Date; updatedAt: Date;
}

const SyllabusUnitSchema = new Schema({ unitNumber: { type: Number, required: true }, title: { type: String, required: true }, topics: [{ type: String }], hours: { type: Number, default: 0 } });
const SyllabusSubjectSchema = new Schema({ name: { type: String, required: true }, code: { type: String, default: "" }, units: [SyllabusUnitSchema] });

const UniversitySyllabusSchema = new Schema<IUniversitySyllabus>({
  university: { type: String, required: true }, branch: { type: String, required: true }, semester: { type: Number, required: true },
  subjects: [SyllabusSubjectSchema],
  uploadedBy: [{ type: Schema.Types.ObjectId, ref: "User" }], originalFileUrls: [{ type: String }], lastUpdatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["processing", "ready", "failed"], default: "processing" }, errorMessage: { type: String, default: "" },
}, { timestamps: true });

UniversitySyllabusSchema.index({ university: 1, branch: 1, semester: 1 }, { unique: true });

const UniversitySyllabus: Model<IUniversitySyllabus> = mongoose.models.UniversitySyllabus || mongoose.model<IUniversitySyllabus>("UniversitySyllabus", UniversitySyllabusSchema);
export default UniversitySyllabus;
