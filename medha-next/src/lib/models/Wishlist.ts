import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IWishlist extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  products: Types.ObjectId[];
}

const wishlistSchema = new Schema<IWishlist>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const Wishlist: Model<IWishlist> =
  mongoose.models.Wishlist || mongoose.model<IWishlist>("Wishlist", wishlistSchema);

export default Wishlist;
