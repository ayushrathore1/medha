import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type ShipmentStatus =
  | "pending"
  | "pickup_scheduled"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed";

export interface ITrackingEvent {
  status: ShipmentStatus;
  timestamp: Date;
  note?: string;
  updatedBy?: Types.ObjectId;
}

export interface IShipment extends Document {
  _id: Types.ObjectId;
  order: Types.ObjectId;
  pickupAddress: string;
  deliveryAddress: string;
  status: ShipmentStatus;
  assignedAgent?: Types.ObjectId;
  trackingEvents: ITrackingEvent[];
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  proofOfDelivery?: string;
  createdAt: Date;
  updatedAt: Date;
}

const trackingEventSchema = new Schema<ITrackingEvent>(
  {
    status: { type: String, enum: ["pending", "pickup_scheduled", "picked_up", "in_transit", "out_for_delivery", "delivered", "failed"], required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: "" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

const shipmentSchema = new Schema<IShipment>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
    pickupAddress: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "pickup_scheduled", "picked_up", "in_transit", "out_for_delivery", "delivered", "failed"],
      default: "pending",
    },
    assignedAgent: { type: Schema.Types.ObjectId, ref: "User" },
    trackingEvents: { type: [trackingEventSchema], default: [] },
    estimatedDelivery: { type: Date },
    actualDelivery: { type: Date },
    proofOfDelivery: { type: String, default: "" },
  },
  { timestamps: true }
);

shipmentSchema.index({ order: 1 }, { unique: true });
shipmentSchema.index({ status: 1, assignedAgent: 1 });

const Shipment: Model<IShipment> = mongoose.models.Shipment || mongoose.model<IShipment>("Shipment", shipmentSchema);

export default Shipment;