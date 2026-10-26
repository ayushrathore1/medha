import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWallpaper extends Document { name: string; url: string; publicId: string; themes: string[]; categories: string[]; isPremium: boolean; createdAt: Date; }
const wallpaperSchema = new Schema<IWallpaper>({ name: { type: String, required: true }, url: { type: String, required: true }, publicId: { type: String, required: true }, themes: [{ type: String }], categories: [{ type: String }], isPremium: { type: Boolean, default: false }, createdAt: { type: Date, default: Date.now } });
const Wallpaper: Model<IWallpaper> = mongoose.models.Wallpaper || mongoose.model<IWallpaper>("Wallpaper", wallpaperSchema);
export default Wallpaper;
