import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISyllabus extends Document { subjectCode: string; subjectName: string; semester: number; credits: number; maxMarks: number; iaMarks: number; eteMarks: number; examDuration: string; totalHours: number; units: Array<{ unitNumber: number; title: string; topics: string[]; hours: number; }>; createdAt: Date; }

const UnitSchema = new Schema({ unitNumber: { type: Number, required: true }, title: { type: String, required: true }, topics: [{ type: String }], hours: { type: Number, default: 0 } });

const SyllabusSchema = new Schema<ISyllabus>({ subjectCode: { type: String, required: true, unique: true }, subjectName: { type: String, required: true }, semester: { type: Number, required: true }, credits: { type: Number, default: 3 }, maxMarks: { type: Number, default: 100 }, iaMarks: { type: Number, default: 30 }, eteMarks: { type: Number, default: 70 }, examDuration: { type: String, default: "3 Hours" }, totalHours: { type: Number, default: 40 }, units: [UnitSchema], createdAt: { type: Date, default: Date.now } });

const Syllabus: Model<ISyllabus> = mongoose.models.Syllabus || mongoose.model<ISyllabus>("Syllabus", SyllabusSchema);
export default Syllabus;
