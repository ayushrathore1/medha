import mongoose, { Schema, Document, Model, Types } from "mongoose";

/* ─── Interfaces ─── */
interface IMediaUrl {
  url: string;
  type: "image" | "video" | "file";
  filename: string;
}

export interface IPost extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  author: Types.ObjectId;
  isAnonymous: boolean;
  mediaUrls: IMediaUrl[];
  tag: "doubts" | "resources" | "memes" | "off-topic" | "announcements";
  upvotes: number;
  downvotes: number;
  hotScore: number;
  commentCount: number;
  shareSlug?: string;
  mentions: Types.ObjectId[];
  hasAdminMention: boolean;
  isDeleted: boolean;
  score: number; // virtual
  createdAt: Date;
  updatedAt: Date;
}

/* ─── Schema ─── */
const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true, maxlength: 300 },
    content: { type: String, required: true, maxlength: 10000 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isAnonymous: { type: Boolean, default: false },
    mediaUrls: [{
      url: String,
      type: { type: String, enum: ["image", "video", "file"] },
      filename: String,
    }],
    tag: { type: String, enum: ["doubts", "resources", "memes", "off-topic", "announcements"], default: "off-topic" },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    hotScore: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    shareSlug: { type: String, unique: true, sparse: true },
    mentions: [{ type: Schema.Types.ObjectId, ref: "User" }],
    hasAdminMention: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

postSchema.index({ hotScore: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ tag: 1, createdAt: -1 });
postSchema.index({ author: 1 });
postSchema.index({ shareSlug: 1 });

postSchema.pre("save", function (next) {
  if (!this.shareSlug) {
    this.shareSlug = Math.random().toString(36).substring(2, 10);
  }
  next();
});

postSchema.virtual("score").get(function () {
  return this.upvotes - this.downvotes;
});

const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;
