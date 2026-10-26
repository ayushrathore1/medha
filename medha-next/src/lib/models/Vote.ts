import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IVote extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  targetType: "post" | "comment";
  targetId: Types.ObjectId;
  targetModel: "Post" | "CharchaComment";
  voteType: 1 | -1;
  createdAt: Date;
  updatedAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetType: { type: String, enum: ["post", "comment"], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true, refPath: "targetModel" },
    targetModel: { type: String, enum: ["Post", "CharchaComment"], required: true },
    voteType: { type: Number, enum: [1, -1], required: true },
  },
  { timestamps: true }
);

voteSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });
voteSchema.index({ targetId: 1, targetType: 1 });

const Vote: Model<IVote> =
  mongoose.models.Vote || mongoose.model<IVote>("Vote", voteSchema);

export default Vote;
