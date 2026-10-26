import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type ProductCondition = "new" | "like-new" | "good" | "fair" | "used";
export type QualityVerification = "pending" | "verified" | "premium" | "standard";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  sellerPrice: number;
  commissionPercent: number;
  commissionAmount: number;
  images: string[];
  category: Types.ObjectId;
  stock: number;
  seller: Types.ObjectId;
  condition: ProductCondition;
  college: string;
  qualityVerification: QualityVerification;
  featured: boolean;
  status: "active" | "sold" | "inactive";
  tags: string[];
  averageRating: number;
  reviewCount: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    sellerPrice: { type: Number, required: true, min: 10, max: 50000 },
    commissionPercent: { type: Number, default: 6, min: 0, max: 100 },
    commissionAmount: { type: Number, default: 0 },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, default: 1, min: 0 },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    condition: {
      type: String,
      enum: ["new", "like-new", "good", "fair", "used"],
      default: "used",
    },
    college: { type: String, default: "" },
    qualityVerification: {
      type: String,
      enum: ["pending", "verified", "premium", "standard"],
      default: "pending",
    },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "sold", "inactive"],
      default: "active",
    },
    tags: [{ type: String }],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.isModified("sellerPrice") || this.isModified("commissionPercent")) {
    this.commissionAmount = Math.round(this.sellerPrice * this.commissionPercent) / 100;
    this.price = this.sellerPrice + this.commissionAmount;
  }
  next();
});

productSchema.index({ category: 1, status: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ price: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
