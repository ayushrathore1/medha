import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface ISessionMessage { role: "user" | "assistant"; content: string; timestamp: Date; }

export interface IChatSession extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  messages: ISessionMessage[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema({ role: { type: String, enum: ["user", "assistant"], required: true }, content: { type: String, required: true }, timestamp: { type: Date, default: Date.now } });

const ChatSessionSchema = new Schema<IChatSession>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "New Chat" },
    messages: [MessageSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ChatSessionSchema.index({ user: 1, updatedAt: -1 });

const ChatSession: Model<IChatSession> =
  mongoose.models.ChatSession || mongoose.model<IChatSession>("ChatSession", ChatSessionSchema);

export default ChatSession;
