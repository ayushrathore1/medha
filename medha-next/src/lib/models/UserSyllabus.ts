import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUserSyllabus extends Document {
  _id: Types.ObjectId; userId: Types.ObjectId;
  originalFileUrl: string; rawText: string;
  subjects: Array<{ name: string; code: string; semester: number; units: Array<{ unitNumber: number; title: string; topics: string[]; hours: number; }>; }>;
  university: string; branch: string;
  status: "processing" | "ready" | "failed"; errorMessage: string;
  createdAt: Date; updatedAt: Date;
}

const SyllabusUnitSchema = new Schema({ unitNumber: { type: Number, required: true }, title: { type: String, required: true }, topics: [{ type: String }], hours: { type: Number, default: 0 } });
const SyllabusSubjectSchema = new Schema({ name: { type: String, required: true }, code: { type: String, default: "" }, semester: { type: Number, default: 0 }, units: [SyllabusUnitSchema] });

const UserSyllabusSchema = new Schema<IUserSyllabus>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  originalFileUrl: { type: String, default: "" }, rawText: { type: String, default: "" },
  subjects: [SyllabusSubjectSchema],
  university: { type: String, default: "" }, branch: { type: String, default: "" },
  status: { type: String, enum: ["processing", "ready", "failed"], default: "processing" }, errorMessage: { type: String, default: "" },
}, { timestamps: true });

const UserSyllabus: Model<IUserSyllabus> = mongoose.models.UserSyllabus || mongoose.model<IUserSyllabus>("UserSyllabus", UserSyllabusSchema);
export default UserSyllabus;
