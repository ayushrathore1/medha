import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface ILastMessage { text: string; sender?: Types.ObjectId; timestamp: Date; }

export interface IConversation extends Document {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
  lastMessage: ILastMessage;
  unreadCount: Map<string, number>;
  isBroadcast: boolean;
  broadcastRecipients: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: {
      text: { type: String, default: "" },
      sender: { type: Schema.Types.ObjectId, ref: "User" },
      timestamp: { type: Date, default: Date.now },
    },
    unreadCount: { type: Map, of: Number, default: {} },
    isBroadcast: { type: Boolean, default: false },
    broadcastRecipients: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });
conversationSchema.index({ "lastMessage.timestamp": -1 });
conversationSchema.index({ isBroadcast: 1 });

const Conversation: Model<IConversation> =
  mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", conversationSchema);

export default Conversation;
