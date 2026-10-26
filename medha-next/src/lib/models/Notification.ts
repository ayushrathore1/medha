import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface INotification extends Document {
  _id: Types.ObjectId;
  recipient: Types.ObjectId;
  type: "info" | "success" | "warning" | "error" | "message" | "like" | "feature";
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  sender: Types.ObjectId | null;
  category: "order" | "payment" | "delivery" | "product" | "system" | "study";
  data: Record<string, unknown>;
  actionUrl: string | null;
  priority: "low" | "normal" | "high" | "urgent";
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["info", "success", "warning", "error", "message", "like", "feature"], default: "info" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, default: null },
    read: { type: Boolean, default: false },
    sender: { type: Schema.Types.ObjectId, ref: "User", default: null },
    category: { type: String, enum: ["order", "payment", "delivery", "product", "system", "study"], default: "system" },
    data: { type: Schema.Types.Mixed, default: {} },
    actionUrl: { type: String, default: null },
    priority: { type: String, enum: ["low", "normal", "high", "urgent"], default: "normal" },
  },
  { timestamps: true }
);

const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
