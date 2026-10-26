import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `"Medha CampusCart" <${process.env.SMTP_USER || "noreply@medha.app"}>`;

/* ─── Order Confirmation → Buyer ─── */
export async function sendOrderConfirmation(params: {
  buyerEmail: string;
  buyerName: string;
  orderNumber: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: { college: string; hostel?: string; room?: string };
}) {
  const itemRows = params.items
    .map(
      (item) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee">${item.name}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">₹${item.price}</td></tr>`
    )
    .join("");

  const html = `
    <div style="font-family:'Inter',sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee">
      <div style="background:linear-gradient(135deg,#E8622A,#D4521A);padding:32px 24px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px">Order Confirmed! 🎉</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px">Thank you for shopping on CampusCart</p>
      </div>
      <div style="padding:24px">
        <p style="margin:0 0 8px;font-size:15px">Hi <strong>${params.buyerName}</strong>,</p>
        <p style="margin:0 0 20px;font-size:14px;color:#666">Your order <strong style="color:#E8622A">${params.orderNumber}</strong> has been placed successfully.</p>
        
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px">
          <thead><tr style="background:#f9f9f9"><th style="padding:8px 12px;text-align:left">Item</th><th style="padding:8px 12px;text-align:center">Qty</th><th style="padding:8px 12px;text-align:right">Price</th></tr></thead>
          <tbody>${itemRows}</tbody>
          <tfoot><tr><td colspan="2" style="padding:10px 12px;font-weight:bold">Total</td><td style="padding:10px 12px;text-align:right;font-weight:bold;font-size:16px;color:#E8622A">₹${params.totalAmount}</td></tr></tfoot>
        </table>

        <div style="background:#f9f9f9;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px">
          <strong>📍 Delivery:</strong> ${params.shippingAddress.college}${params.shippingAddress.hostel ? ` · ${params.shippingAddress.hostel}` : ""}${params.shippingAddress.room ? ` Room ${params.shippingAddress.room}` : ""}<br/>
          <strong>💳 Payment:</strong> ${params.paymentMethod === "online" ? "Paid Online ✓" : "Cash on Delivery"}
        </div>

        <p style="font-size:12px;color:#999;margin:16px 0 0">You'll receive updates when your order is shipped. Track your order on Medha CampusCart.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: FROM,
      to: params.buyerEmail,
      subject: `Order Confirmed — ${params.orderNumber} | CampusCart`,
      html,
    });
  } catch (err) {
    console.error("Send order confirmation email error:", err);
  }
}

/* ─── New Order Notification → Seller ─── */
export async function sendNewOrderToSeller(params: {
  sellerEmail: string;
  sellerName: string;
  orderNumber: string;
  buyerName: string;
  buyerCollege: string;
  items: Array<{ name: string; quantity: number; sellerEarning: number }>;
  totalEarning: number;
}) {
  const itemRows = params.items
    .map(
      (item) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee">${item.name}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;color:#16a34a">₹${item.sellerEarning}</td></tr>`
    )
    .join("");

  const html = `
    <div style="font-family:'Inter',sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee">
      <div style="background:linear-gradient(135deg,#16a34a,#15803d);padding:32px 24px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px">New Order! 🧾</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px">You have a new sale on CampusCart</p>
      </div>
      <div style="padding:24px">
        <p style="margin:0 0 8px;font-size:15px">Hi <strong>${params.sellerName}</strong>,</p>
        <p style="margin:0 0 20px;font-size:14px;color:#666"><strong>${params.buyerName}</strong> from <strong>${params.buyerCollege}</strong> ordered your item(s).</p>
        
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px">
          <thead><tr style="background:#f0fdf4"><th style="padding:8px 12px;text-align:left">Item</th><th style="padding:8px 12px;text-align:center">Qty</th><th style="padding:8px 12px;text-align:right">Your Earning</th></tr></thead>
          <tbody>${itemRows}</tbody>
          <tfoot><tr><td colspan="2" style="padding:10px 12px;font-weight:bold">Total Earning</td><td style="padding:10px 12px;text-align:right;font-weight:bold;font-size:16px;color:#16a34a">₹${params.totalEarning}</td></tr></tfoot>
        </table>

        <p style="font-size:13px;color:#666">Please confirm and fulfill this order from your <a href="${process.env.APP_BASE_URL || "http://localhost:3000"}/campus-cart/dashboard" style="color:#E8622A;font-weight:600">Seller Dashboard</a>.</p>
        <p style="font-size:12px;color:#999;margin:16px 0 0">Order ID: ${params.orderNumber}</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: FROM,
      to: params.sellerEmail,
      subject: `New Sale — ${params.orderNumber} | CampusCart`,
      html,
    });
  } catch (err) {
    console.error("Send seller notification email error:", err);
  }
}

/* ─── Order Status Update → Buyer ─── */
export async function sendOrderStatusUpdate(params: {
  buyerEmail: string;
  buyerName: string;
  orderNumber: string;
  newStatus: string;
  items: Array<{ name: string }>;
}) {
  const statusEmoji: Record<string, string> = {
    confirmed: "✅",
    shipped: "🚚",
    delivered: "📦",
    cancelled: "❌",
  };

  const statusMessage: Record<string, string> = {
    confirmed: "Your order has been confirmed by the seller and is being prepared.",
    shipped: "Your order is on the way! The seller has shipped your items.",
    delivered: "Your order has been delivered. Enjoy your purchase!",
    cancelled: "Your order has been cancelled.",
  };

  const html = `
    <div style="font-family:'Inter',sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee">
      <div style="background:#18120e;padding:32px 24px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px">${statusEmoji[params.newStatus] || "📋"} Order ${params.newStatus.charAt(0).toUpperCase() + params.newStatus.slice(1)}</h1>
      </div>
      <div style="padding:24px">
        <p style="margin:0 0 8px;font-size:15px">Hi <strong>${params.buyerName}</strong>,</p>
        <p style="margin:0 0 16px;font-size:14px;color:#666">${statusMessage[params.newStatus] || `Your order status has been updated to: ${params.newStatus}`}</p>
        <div style="background:#f9f9f9;border-radius:8px;padding:12px 16px;font-size:13px">
          <strong>Order:</strong> ${params.orderNumber}<br/>
          <strong>Items:</strong> ${params.items.map((i) => i.name).join(", ")}
        </div>
        <p style="font-size:12px;color:#999;margin:16px 0 0">Track your order on <a href="${process.env.APP_BASE_URL || "http://localhost:3000"}/campus-cart/orders" style="color:#E8622A">CampusCart</a>.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: FROM,
      to: params.buyerEmail,
      subject: `Order ${params.newStatus} — ${params.orderNumber} | CampusCart`,
      html,
    });
  } catch (err) {
    console.error("Send status update email error:", err);
  }
}
