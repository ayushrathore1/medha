import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IPremiumInterest extends Document { userId: Types.ObjectId; createdAt: Date; }
const premiumInterestSchema = new Schema<IPremiumInterest>({ userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true }, createdAt: { type: Date, default: Date.now } });
const PremiumInterest: Model<IPremiumInterest> = mongoose.models.PremiumInterest || mongoose.model<IPremiumInterest>("PremiumInterest", premiumInterestSchema);
export default PremiumInterest;
