import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISubject extends Document {
  _id: Types.ObjectId;
  name: string;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

subjectSchema.index({ name: 1, user: 1 }, { unique: true });

const Subject: Model<ISubject> =
  mongoose.models.Subject || mongoose.model<ISubject>("Subject", subjectSchema);

export default Subject;
