import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type WalletTransactionType = "credit" | "debit" | "escrow" | "payout" | "refund";

export interface IWalletTransaction {
  type: WalletTransactionType;
  amount: number;
  description: string;
  orderId?: Types.ObjectId;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

export interface IWallet extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  availableBalance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  transactions: IWalletTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<IWalletTransaction>(
  {
    type: { type: String, enum: ["credit", "debit", "escrow", "payout", "refund"], required: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "completed" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const walletSchema = new Schema<IWallet>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    availableBalance: { type: Number, default: 0, min: 0 },
    pendingBalance: { type: Number, default: 0, min: 0 },
    totalEarned: { type: Number, default: 0, min: 0 },
    totalWithdrawn: { type: Number, default: 0, min: 0 },
    transactions: { type: [transactionSchema], default: [] },
  },
  { timestamps: true }
);

walletSchema.index({ user: 1 }, { unique: true });
walletSchema.index({ "transactions.orderId": 1 });

const Wallet: Model<IWallet> = mongoose.models.Wallet || mongoose.model<IWallet>("Wallet", walletSchema);

export default Wallet;