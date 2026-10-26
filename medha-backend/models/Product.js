const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
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
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, default: 1, min: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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

module.exports = mongoose.model("Product", productSchema);
