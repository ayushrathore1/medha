import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDailyQuote extends Document { quote: string; author: string; source: string | null; date: string; createdAt: Date; }
const dailyQuoteSchema = new Schema<IDailyQuote>({ quote: { type: String, required: true }, author: { type: String, required: true }, source: { type: String, default: null }, date: { type: String, required: true, unique: true }, createdAt: { type: Date, default: Date.now } });
const DailyQuote: Model<IDailyQuote> = mongoose.models.DailyQuote || mongoose.model<IDailyQuote>("DailyQuote", dailyQuoteSchema);
export default DailyQuote;
