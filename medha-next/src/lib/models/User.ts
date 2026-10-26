import mongoose, { Schema, Document, Model, Types } from "mongoose";

/* ─── Interface ─── */
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  authProvider: "local" | "google" | "both";
  college: string;
  university: string;
  branch: string;
  year: string;
  gender: "" | "Male" | "Female" | "Other";
  phone?: string;
  avatar: string;
  avatarIndex: number;
  streak: number;
  lastActiveDate: Date | null;
  activityHistory: Date[];
  dailyPlan: string;
  dailyPlanDate: Date | null;
  isAdmin: boolean;
  role: "user" | "team" | "admin" | "buyer" | "seller";
  isVerifiedStudent: boolean;
  sellerVerified: boolean;
  savedAddresses: Array<{
    label: string;
    fullName: string;
    phone: string;
    college: string;
    hostel?: string;
    room?: string;
    landmark?: string;
    isDefault: boolean;
  }>;
  featureNotificationViews: number;
  likedNotes: Types.ObjectId[];
  emailVerified: boolean;
  // Charcha fields
  charchaUsername?: string;
  karma: number;
  rank: "Noob" | "Scholar" | "Expert" | "Guru" | "Legend";
  followerCount: number;
  followingCount: number;
  customFlair: string;
  anonymousPostsToday: number;
  lastAnonymousReset: Date | null;
  charchaJoinedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/* ─── Schema ─── */
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, minlength: 6, select: false },
    googleId: { type: String, sparse: true, unique: true },
    authProvider: { type: String, enum: ["local", "google", "both"], default: "local" },
    college: { type: String, default: "", trim: true },
    university: { type: String, default: "", trim: true },
    branch: { type: String, default: "", trim: true },
    year: { type: String, default: "", trim: true },
    gender: { type: String, enum: ["", "Male", "Female", "Other"], default: "" },
    phone: { type: String, default: "", trim: true },
    avatar: { type: String, default: "" },
    avatarIndex: { type: Number, default: 0, min: 0, max: 19 },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
    activityHistory: [{ type: Date }],
    dailyPlan: { type: String, default: "" },
    dailyPlanDate: { type: Date, default: null },
    isAdmin: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "team", "admin", "buyer", "seller"], default: "user" },
    isVerifiedStudent: { type: Boolean, default: false },
    sellerVerified: { type: Boolean, default: false },
    savedAddresses: [
      {
        label: { type: String, default: "Home" },
        fullName: { type: String, default: "" },
        phone: { type: String, default: "" },
        college: { type: String, default: "" },
        hostel: { type: String, default: "" },
        room: { type: String, default: "" },
        landmark: { type: String, default: "" },
        isDefault: { type: Boolean, default: false },
      },
    ],
    featureNotificationViews: { type: Number, default: 0 },
    likedNotes: [{ type: Schema.Types.ObjectId, ref: "Note" }],
    emailVerified: { type: Boolean, default: false },
    // Charcha fields
    charchaUsername: { type: String, unique: true, sparse: true, trim: true },
    karma: { type: Number, default: 0 },
    rank: { type: String, enum: ["Noob", "Scholar", "Expert", "Guru", "Legend"], default: "Noob" },
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    customFlair: { type: String, maxlength: 30, default: "" },
    anonymousPostsToday: { type: Number, default: 0 },
    lastAnonymousReset: { type: Date, default: null },
    charchaJoinedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.email === "rathoreayush512@gmail.com") {
    this.isAdmin = true;
    this.role = "admin";
  }
  next();
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
