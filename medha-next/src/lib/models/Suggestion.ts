import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISuggestion extends Document { message: string; emoji?: string | null; userAgent?: string; ip?: string; isRead: boolean; status: "new" | "noted" | "planned" | "done" | "wontdo"; adminNote: string; createdAt: Date; updatedAt: Date; }
const SuggestionSchema = new Schema<ISuggestion>({ message: { type: String, required: true, trim: true, maxlength: 2000 }, emoji: { type: String, default: null }, userAgent: String, ip: String, isRead: { type: Boolean, default: false }, status: { type: String, enum: ["new", "noted", "planned", "done", "wontdo"], default: "new" }, adminNote: { type: String, default: "" } }, { timestamps: true });
const Suggestion: Model<ISuggestion> = mongoose.models.Suggestion || mongoose.model<ISuggestion>("Suggestion", SuggestionSchema);
export default Suggestion;
