import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IMention extends Document {
  _id: Types.ObjectId;
  mentioner: Types.ObjectId;
  mentionedUser: Types.ObjectId;
  sourceType: "post" | "comment";
  sourceId: Types.ObjectId;
  sourceModel: "Post" | "CharchaComment";
  isAdminMention: boolean;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const mentionSchema = new Schema<IMention>(
  {
    mentioner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mentionedUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sourceType: { type: String, enum: ["post", "comment"], required: true },
    sourceId: { type: Schema.Types.ObjectId, required: true, refPath: "sourceModel" },
    sourceModel: { type: String, enum: ["Post", "CharchaComment"], required: true },
    isAdminMention: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

mentionSchema.index({ mentionedUser: 1, isRead: 1, createdAt: -1 });
mentionSchema.index({ isAdminMention: 1, isRead: 1, createdAt: -1 });
mentionSchema.index({ mentioner: 1 });

const Mention: Model<IMention> =
  mongoose.models.Mention || mongoose.model<IMention>("Mention", mentionSchema);

export default Mention;
