import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IPasswordResetToken extends Document { userId: Types.ObjectId; tokenHash: string; expiresAt: Date; used: boolean; }

const schema = new Schema<IPasswordResetToken>({ userId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true }, tokenHash: { type: String, required: true, index: true }, expiresAt: { type: Date, required: true }, used: { type: Boolean, default: false } });

schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordResetToken: Model<IPasswordResetToken> = mongoose.models.PasswordResetToken || mongoose.model<IPasswordResetToken>("PasswordResetToken", schema);
export default PasswordResetToken;
