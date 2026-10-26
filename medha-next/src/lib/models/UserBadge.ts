import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUserBadge extends Document { _id: Types.ObjectId; user: Types.ObjectId; badge: Types.ObjectId; earnedAt: Date; createdAt: Date; updatedAt: Date; }

const userBadgeSchema = new Schema<IUserBadge>({ user: { type: Schema.Types.ObjectId, ref: "User", required: true }, badge: { type: Schema.Types.ObjectId, ref: "Badge", required: true }, earnedAt: { type: Date, default: Date.now } }, { timestamps: true });

userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });
userBadgeSchema.index({ user: 1 });

const UserBadge: Model<IUserBadge> = mongoose.models.UserBadge || mongoose.model<IUserBadge>("UserBadge", userBadgeSchema);
export default UserBadge;
