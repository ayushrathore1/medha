import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITopic extends Document { _id: Types.ObjectId; name: string; owner: Types.ObjectId; difficulty: "easy" | "medium" | "hard"; subject: string; createdAt: Date; updatedAt: Date; }
const TopicSchema = new Schema<ITopic>({ name: { type: String, required: true, trim: true }, owner: { type: Schema.Types.ObjectId, ref: "User", required: true }, difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" }, subject: { type: String, default: "General" } }, { timestamps: true });
TopicSchema.index({ name: 1, owner: 1 }, { unique: true });
const Topic: Model<ITopic> = mongoose.models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);
export default Topic;
