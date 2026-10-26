import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type FulfillmentStatus =
  | "pending"
  | "pickup_scheduled"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type RefundStatus = "none" | "requested" | "processing" | "completed";

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
  seller: Types.ObjectId;
  sellerEarning: number;
}

export interface ISellerPayout {
  seller: Types.ObjectId;
  amount: number;
  status: "pending" | "paid";
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  sellerId?: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  fulfillmentStatus: FulfillmentStatus;
  shippingAddress: {
    fullName: string;
    phone: string;
    college: string;
    hostel?: string;
    room?: string;
    landmark?: string;
  };
  paymentMethod: "cod" | "online";
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  paymentId?: string;
  razorpaySignature?: string;
  paidAt?: Date;
  orderNotes?: string;
  orderNumber: string;
  sellerPayouts: ISellerPayout[];
  buyerConfirmedAt?: Date;
  disputeReason?: string;
  isDisputed: boolean;
  refundStatus: RefundStatus;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    seller: { type: Schema.Types.ObjectId, ref: "User" },
    sellerEarning: { type: Number, default: 0 },
  },
  { _id: false }
);

const sellerPayoutSchema = new Schema<ISellerPayout>(
  {
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "User" },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    fulfillmentStatus: {
      type: String,
      enum: [
        "pending",
        "pickup_scheduled",
        "picked_up",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "failed",
      ],
      default: "pending",
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      college: { type: String, required: true },
      hostel: { type: String },
      room: { type: String },
      landmark: { type: String },
    },
    paymentMethod: { type: String, enum: ["cod", "online"], default: "cod" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    razorpayOrderId: { type: String },
    paymentId: { type: String },
    razorpaySignature: { type: String },
    paidAt: { type: Date },
    orderNotes: { type: String },
    orderNumber: { type: String, required: true, unique: true },
    sellerPayouts: [sellerPayoutSchema],
    buyerConfirmedAt: { type: Date },
    disputeReason: { type: String },
    isDisputed: { type: Boolean, default: false },
    refundStatus: {
      type: String,
      enum: ["none", "requested", "processing", "completed"],
      default: "none",
    },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ "items.seller": 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ razorpayOrderId: 1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;

