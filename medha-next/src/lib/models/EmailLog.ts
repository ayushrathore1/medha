import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEmailLog extends Document { subject: string; htmlBody: string; sentCount: number; totalRecipients: number; recipients: string[]; lastSentAt: Date; createdAt: Date; updatedAt: Date; }
const emailLogSchema = new Schema<IEmailLog>({ subject: { type: String, required: true }, htmlBody: { type: String, required: true }, sentCount: { type: Number, default: 0 }, totalRecipients: { type: Number, default: 0 }, recipients: { type: [String], default: [] }, lastSentAt: { type: Date, default: Date.now } }, { timestamps: true });
emailLogSchema.index({ subject: 1, htmlBody: 1 });
const EmailLog: Model<IEmailLog> = mongoose.models.EmailLog || mongoose.model<IEmailLog>("EmailLog", emailLogSchema);
export default EmailLog;
