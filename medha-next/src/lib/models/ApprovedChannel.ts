import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApprovedChannel extends Document { channelId: string; channelName: string; channelUrl: string; subjectTags: string[]; priority: number; isActive: boolean; notes: string; createdAt: Date; updatedAt: Date; }
const approvedChannelSchema = new Schema<IApprovedChannel>({ channelId: { type: String, required: true, unique: true, trim: true }, channelName: { type: String, required: true, trim: true }, channelUrl: { type: String, required: true, trim: true }, subjectTags: { type: [String], default: [], index: true }, priority: { type: Number, default: 5, min: 1, max: 10 }, isActive: { type: Boolean, default: true }, notes: { type: String, default: "" } }, { timestamps: true });
const ApprovedChannel: Model<IApprovedChannel> = mongoose.models.ApprovedChannel || mongoose.model<IApprovedChannel>("ApprovedChannel", approvedChannelSchema);
export default ApprovedChannel;
