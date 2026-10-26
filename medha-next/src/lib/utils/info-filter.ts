type AnyRecord = Record<string, unknown>;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function stripOrderCommon(order: AnyRecord) {
  const result = clone(order);
  delete result.razorpaySignature;
  delete result.paymentId;
  return result;
}

export function filterOrderForSeller(order: AnyRecord) {
  const result = stripOrderCommon(order);
  delete result.shippingAddress;
  delete result.user;
  return result;
}

export function filterOrderForBuyer(order: AnyRecord) {
  const result = stripOrderCommon(order);
  delete result.sellerId;
  if (Array.isArray(result.items)) {
    result.items = result.items.map((item) => {
      const nextItem = item as AnyRecord;
      if (nextItem.product && typeof nextItem.product === "object") {
        const product = clone(nextItem.product as AnyRecord);
        delete product.seller;
        nextItem.product = product;
      }
      return nextItem;
    });
  }
  return result;
}

export function filterOrderForAdmin(order: AnyRecord) {
  return clone(order);
}