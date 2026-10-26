import { connectDB } from "@/lib/db/mongoose";
import Order from "@/lib/models/Order";
import Shipment from "@/lib/models/Shipment";

function toAddressText(address: Record<string, unknown>) {
  return [address.fullName, address.phone, address.college, address.hostel, address.room, address.landmark].filter(Boolean).join(", ");
}

export async function createShipment(orderId: string) {
  await connectDB();
  const order = await Order.findById(orderId);
  if (!order) return null;

  const existing = await Shipment.findOne({ order: orderId });
  if (existing) return existing;

  const shippingAddress = order.shippingAddress as unknown as Record<string, unknown>;
  const shipment = await Shipment.create({
    order: orderId,
    pickupAddress: toAddressText(shippingAddress),
    deliveryAddress: toAddressText(shippingAddress),
    trackingEvents: [{ status: "pending", timestamp: new Date(), note: "Shipment created" }],
    status: "pending",
  });

  order.fulfillmentStatus = "pending";
  await order.save();
  return shipment;
}

export async function schedulePickup(shipmentId: string, agentId?: string) {
  await connectDB();
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) return null;
  shipment.status = "pickup_scheduled";
  if (agentId) shipment.assignedAgent = agentId as never;
  shipment.trackingEvents.push({ status: "pickup_scheduled", timestamp: new Date(), note: "Pickup scheduled" });
  await shipment.save();
  return shipment;
}

export async function markPickedUp(shipmentId: string, note?: string) {
  await connectDB();
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) return null;
  shipment.status = "picked_up";
  shipment.trackingEvents.push({ status: "picked_up", timestamp: new Date(), note: note || "Picked up" });
  await shipment.save();
  return shipment;
}

export async function markDelivered(shipmentId: string, note?: string, proofUrl?: string) {
  await connectDB();
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) return null;
  shipment.status = "delivered";
  shipment.actualDelivery = new Date();
  if (proofUrl) shipment.proofOfDelivery = proofUrl;
  shipment.trackingEvents.push({ status: "delivered", timestamp: new Date(), note: note || "Delivered" });
  await shipment.save();
  return shipment;
}

export async function getETAEstimate(_pickupCollege: string, _deliveryCollege: string) {
  return new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
}