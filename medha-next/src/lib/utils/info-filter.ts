type AnyRecord = Record<string, unknown>;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function asRecord(order: object): AnyRecord {
  return clone(order) as AnyRecord;
}

function stripOrderCommon(order: object) {
  const result = asRecord(order);
  delete result.razorpaySignature;
  delete result.paymentId;
  return result;
}

export function filterOrderForSeller(order: object) {
  const result = stripOrderCommon(order);
  delete result.shippingAddress;
  delete result.user;
  return result;
}

export function filterOrderForBuyer(order: object) {
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

export function filterOrderForAdmin(order: object) {
  return asRecord(order);
}