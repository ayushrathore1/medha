import crypto from "crypto";

/* ─── Razorpay Config ─── */
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "secret_placeholder";
const RAZORPAY_API = "https://api.razorpay.com/v1";

function authHeader(): string {
  return "Basic " + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
}

/* ─── Types ─── */
export interface RazorpayOrderParams {
  amount: number; // in paisa (₹100 = 10000)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

export interface RazorpayVerifyParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/* ─── Create Order ─── */
export async function createRazorpayOrder(params: RazorpayOrderParams): Promise<RazorpayOrder> {
  const res = await fetch(`${RAZORPAY_API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency || "INR",
      receipt: params.receipt,
      notes: params.notes || {},
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Razorpay create order error:", err);
    throw new Error(err.error?.description || "Failed to create Razorpay order");
  }

  return res.json();
}

/* ─── Verify Signature ─── */
export function verifyRazorpaySignature(params: RazorpayVerifyParams): boolean {
  const body = params.razorpay_order_id + "|" + params.razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === params.razorpay_signature;
}

/* ─── Fetch Payment Details ─── */
export async function fetchPaymentDetails(paymentId: string) {
  const res = await fetch(`${RAZORPAY_API}/payments/${paymentId}`, {
    headers: { Authorization: authHeader() },
  });
  if (!res.ok) throw new Error("Failed to fetch payment details");
  return res.json();
}

export { RAZORPAY_KEY_ID };
