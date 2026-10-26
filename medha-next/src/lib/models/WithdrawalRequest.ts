import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IWithdrawalRequest extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    ifsc: string;
    upiId?: string;
  };
  status: "pending" | "approved" | "processed" | "rejected";
  processedAt?: Date;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalRequestSchema = new Schema<IWithdrawalRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 1 },
    bankDetails: {
      accountName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      ifsc: { type: String, required: true },
      upiId: { type: String, default: "" },
    },
    status: { type: String, enum: ["pending", "approved", "processed", "rejected"], default: "pending" },
    processedAt: { type: Date },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

const WithdrawalRequest: Model<IWithdrawalRequest> =
  mongoose.models.WithdrawalRequest || mongoose.model<IWithdrawalRequest>("WithdrawalRequest", withdrawalRequestSchema);

export default WithdrawalRequest;