import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IChatMessage extends Document {
  _id: Types.ObjectId;
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  text: string;
  readBy: Types.ObjectId[];
  isBroadcast: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isBroadcast: { type: Boolean, default: false },
  },
  { timestamps: true }
);

chatMessageSchema.index({ conversation: 1, createdAt: -1 });
chatMessageSchema.index({ sender: 1 });

const ChatMessage: Model<IChatMessage> =
  mongoose.models.ChatMessage || mongoose.model<IChatMessage>("ChatMessage", chatMessageSchema);

export default ChatMessage;
