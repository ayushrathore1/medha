import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IMessage extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  userName: string;
  userEmail: string;
  type: "feedback" | "feature_request" | "bug_report" | "general";
  subject: string;
  message: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "resolved";
  adminNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    type: { type: String, enum: ["feedback", "feature_request", "bug_report", "general"], default: "general" },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["pending", "in_progress", "resolved"], default: "pending" },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

messageSchema.index({ isRead: 1, createdAt: -1 });
messageSchema.index({ user: 1 });

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);

export default Message;
