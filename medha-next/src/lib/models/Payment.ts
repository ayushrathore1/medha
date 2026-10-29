import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IPayment extends Document {
  _id: Types.ObjectId;
  order: Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "refunded";
  escrowStatus: "held" | "released" | "refunded";
  escrowReleasedAt?: Date;
  refundId?: string;
  refundAmount?: number;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
    razorpayOrderId: { type: String, required: true, index: true },
    razorpayPaymentId: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "paid" },
    escrowStatus: { type: String, enum: ["held", "released", "refunded"], default: "held" },
    escrowReleasedAt: { type: Date },
    refundId: { type: String, default: "" },
    refundAmount: { type: Number, default: 0 },
    refundReason: { type: String, default: "" },
  },
  { timestamps: true }
);

paymentSchema.index({ order: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });

const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;