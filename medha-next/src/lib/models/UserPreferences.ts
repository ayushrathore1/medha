import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUserPreferences extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  notificationPrefs: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    categories: Record<string, { email: boolean; push: boolean; inApp: boolean }>;
  };
  dashboardWidgets: string[];
  recentSearches: string[];
  viewedProducts: Types.ObjectId[];
  viewedSubjects: Types.ObjectId[];
  examDates: Array<{
    subject: string;
    examDate: Date;
    examType: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const userPreferencesSchema = new Schema<IUserPreferences>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    notificationPrefs: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
      categories: { type: Schema.Types.Mixed, default: {} },
    },
    dashboardWidgets: [{ type: String }],
    recentSearches: [{ type: String }],
    viewedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    viewedSubjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    examDates: [
      {
        subject: { type: String, required: true },
        examDate: { type: Date, required: true },
        examType: { type: String, default: "exam" },
      },
    ],
  },
  { timestamps: true }
);

const UserPreferences: Model<IUserPreferences> =
  mongoose.models.UserPreferences || mongoose.model<IUserPreferences>("UserPreferences", userPreferencesSchema);

export default UserPreferences;