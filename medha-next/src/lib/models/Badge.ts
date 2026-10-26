import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBadge extends Document { _id: Types.ObjectId; name: string; displayName: string; description: string; icon: string; criteriaType: "first_post" | "karma_threshold" | "post_count" | "comment_count" | "helpful_answers" | "streak" | "manual"; criteriaValue: number; rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"; createdAt: Date; updatedAt: Date; }

const badgeSchema = new Schema<IBadge>({ name: { type: String, required: true, unique: true }, displayName: { type: String, required: true }, description: { type: String, required: true }, icon: { type: String, required: true }, criteriaType: { type: String, enum: ["first_post", "karma_threshold", "post_count", "comment_count", "helpful_answers", "streak", "manual"], required: true }, criteriaValue: { type: Number, default: 0 }, rarity: { type: String, enum: ["common", "uncommon", "rare", "epic", "legendary"], default: "common" } }, { timestamps: true });

const Badge: Model<IBadge> = mongoose.models.Badge || mongoose.model<IBadge>("Badge", badgeSchema);
export default Badge;
