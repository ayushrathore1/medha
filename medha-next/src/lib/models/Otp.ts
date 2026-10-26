import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtp extends Document { email: string; code: string; type: "registration" | "login" | "verification"; used: boolean; attempts: number; expiresAt: Date; createdAt: Date; }

const otpSchema = new Schema<IOtp>({ email: { type: String, required: true, lowercase: true, trim: true, index: true }, code: { type: String, required: true }, type: { type: String, enum: ["registration", "login", "verification"], default: "registration" }, used: { type: Boolean, default: false }, attempts: { type: Number, default: 0 }, expiresAt: { type: Date, required: true, index: { expires: 0 } }, createdAt: { type: Date, default: Date.now } });

otpSchema.index({ email: 1, code: 1, used: 1 });

const Otp: Model<IOtp> = mongoose.models.Otp || mongoose.model<IOtp>("Otp", otpSchema);
export default Otp;
