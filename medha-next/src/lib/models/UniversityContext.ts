import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUniversityContext extends Document {
  _id: Types.ObjectId; university: string; branch: string; semester: string;
  universityFullName?: string;
  examSchedule: Array<{ date: string; subject: string; subjectCode?: string; }>;
  subjects: Array<{ name: string; code?: string; keywords: string[]; }>;
  systemPromptAdditions: string; additionalInfo: Map<string, string>; isActive: boolean;
  createdAt: Date; updatedAt: Date;
}

interface IUniversityContextModel extends Model<IUniversityContext> {
  findForUser(university: string, branch: string, semester?: string): Promise<IUniversityContext | null>;
}

const universityContextSchema = new Schema<IUniversityContext>({
  university: { type: String, required: true, trim: true }, branch: { type: String, required: true, trim: true, default: "ALL" }, semester: { type: String, default: "ALL" },
  universityFullName: { type: String, trim: true },
  examSchedule: [{ date: String, subject: String, subjectCode: String }],
  subjects: [{ name: String, code: String, keywords: [String] }],
  systemPromptAdditions: { type: String, default: "" }, additionalInfo: { type: Map, of: String }, isActive: { type: Boolean, default: true },
}, { timestamps: true });

universityContextSchema.index({ university: 1, branch: 1, semester: 1 }, { unique: true });

universityContextSchema.statics.findForUser = async function (university: string, branch: string, semester = "ALL") {
  let context = await this.findOne({ university, branch, semester, isActive: true });
  if (!context) context = await this.findOne({ university, branch, semester: "ALL", isActive: true });
  if (!context) context = await this.findOne({ university, branch: "ALL", isActive: true });
  return context;
};

const UniversityContext = (mongoose.models.UniversityContext as IUniversityContextModel) || mongoose.model<IUniversityContext, IUniversityContextModel>("UniversityContext", universityContextSchema);
export default UniversityContext;
