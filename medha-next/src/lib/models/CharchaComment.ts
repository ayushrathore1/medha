import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICharchaComment extends Document {
  _id: Types.ObjectId;
  content: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
  parentComment: Types.ObjectId | null;
  depth: number;
  isAnonymous: boolean;
  upvotes: number;
  downvotes: number;
  wilsonScore: number;
  mentions: Types.ObjectId[];
  hasAdminMention: boolean;
  isDeleted: boolean;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

const charchaCommentSchema = new Schema<ICharchaComment>(
  {
    content: { type: String, required: true, maxlength: 5000 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: "CharchaComment", default: null },
    depth: { type: Number, default: 0, max: 10 },
    isAnonymous: { type: Boolean, default: false },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    wilsonScore: { type: Number, default: 0 },
    mentions: [{ type: Schema.Types.ObjectId, ref: "User" }],
    hasAdminMention: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

charchaCommentSchema.index({ post: 1, createdAt: 1 });
charchaCommentSchema.index({ parentComment: 1 });
charchaCommentSchema.index({ author: 1 });
charchaCommentSchema.index({ wilsonScore: -1 });

charchaCommentSchema.virtual("score").get(function () {
  return this.upvotes - this.downvotes;
});

const CharchaComment: Model<ICharchaComment> =
  mongoose.models.CharchaComment || mongoose.model<ICharchaComment>("CharchaComment", charchaCommentSchema);

export default CharchaComment;
