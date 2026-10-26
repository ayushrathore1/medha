import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITeamInvitation extends Document { email: string; code: string; expiresAt: Date; used: boolean; invitedBy?: Types.ObjectId; createdAt: Date; updatedAt: Date; }
const teamInvitationSchema = new Schema<ITeamInvitation>({ email: { type: String, required: true, trim: true, lowercase: true }, code: { type: String, required: true }, expiresAt: { type: Date, required: true }, used: { type: Boolean, default: false }, invitedBy: { type: Schema.Types.ObjectId, ref: "User" } }, { timestamps: true });
teamInvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const TeamInvitation: Model<ITeamInvitation> = mongoose.models.TeamInvitation || mongoose.model<ITeamInvitation>("TeamInvitation", teamInvitationSchema);
export default TeamInvitation;
