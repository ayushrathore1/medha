import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITodo extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  task: string;
  isCompleted: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema = new Schema<ITodo>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    task: { type: String, required: true, trim: true },
    isCompleted: { type: Boolean, default: false },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), index: { expires: 0 } },
  },
  { timestamps: true }
);

const Todo: Model<ITodo> = mongoose.models.Todo || mongoose.model<ITodo>("Todo", TodoSchema);
export default Todo;
