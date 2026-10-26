import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISearchHistory extends Document { userId?: Types.ObjectId; query: string; subject: string; unit: string; resultCount: number; searchedAt: Date; }
const searchHistorySchema = new Schema<ISearchHistory>({ userId: { type: Schema.Types.ObjectId, ref: "User" }, query: { type: String, required: true, trim: true }, subject: { type: String, default: "" }, unit: { type: String, default: "" }, resultCount: { type: Number, default: 0 }, searchedAt: { type: Date, default: Date.now } });
searchHistorySchema.index({ searchedAt: -1 });
searchHistorySchema.index({ userId: 1 });
const SearchHistory: Model<ISearchHistory> = mongoose.models.SearchHistory || mongoose.model<ISearchHistory>("SearchHistory", searchHistorySchema);
export default SearchHistory;
