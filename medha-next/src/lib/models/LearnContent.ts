import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ILearnContent extends Document {
  _id: Types.ObjectId;
  subject: string; semester: number; unit: number | null; title: string; description: string;
  type: "video" | "pdf" | "animation";
  videoUrl?: string; videoId?: string; videoFileId?: string; thumbnailUrl?: string; thumbnailFileId?: string; duration?: string;
  pdfUrl?: string; pdfFileId?: string; pdfThumbnailUrl?: string; pageCount?: number;
  animationId?: string; animationSteps: number; animationCategory?: string; animationThumbnailUrl?: string;
  slideData: Array<{ stepNumber: number; voiceNoteUrl?: string; voiceNotePublicId?: string; notes: { content: string; fontFamily: string; fontSize: string; fontColor: string; imageUrl?: string; imagePublicId?: string; backgroundColor: string; }; customOverrides: Record<string, unknown>; isHidden: boolean; }>;
  audioHindiUrl?: string; audioHindiFileId?: string; audioEnglishUrl?: string; audioEnglishFileId?: string;
  partAudios: Array<{ partNumber: number; partName?: string; startScene?: number; endScene?: number; audioHindiUrl?: string; audioHindiFileId?: string; audioEnglishUrl?: string; audioEnglishFileId?: string; audioDuration?: number; transcript?: { segments: Array<{ start: number; end: number; text: string; slideNumber?: number; }>; language: string; transcribedAt?: Date; }; manualSlideTimings: Map<string, number>; }>;
  audioTranscript?: { segments: Array<{ id?: number; start: number; end: number; text: string; slideNumber?: number; }>; language: string; duration?: number; transcribedAt?: Date; autoSyncEnabled: boolean; };
  manualSlideTimings: Map<string, number>;
  likes: Types.ObjectId[]; likeCount: number; views: number; order: number; isActive: boolean;
  createdAt: Date; updatedAt: Date;
}

const LearnContentSchema = new Schema<ILearnContent>({
  subject: { type: String, required: true, index: true }, semester: { type: Number, default: 3 }, unit: { type: Number, default: null },
  title: { type: String, required: true }, description: { type: String, default: "" }, type: { type: String, enum: ["video", "pdf", "animation"], required: true },
  videoUrl: String, videoId: String, videoFileId: String, thumbnailUrl: String, thumbnailFileId: String, duration: String,
  pdfUrl: String, pdfFileId: String, pdfThumbnailUrl: String, pageCount: Number,
  animationId: String, animationSteps: { type: Number, default: 1 }, animationCategory: String, animationThumbnailUrl: String,
  slideData: [{ stepNumber: { type: Number, required: true }, voiceNoteUrl: String, voiceNotePublicId: String, notes: { content: { type: String, default: "" }, fontFamily: { type: String, default: "Inter" }, fontSize: { type: String, default: "16px" }, fontColor: { type: String, default: "#ffffff" }, imageUrl: String, imagePublicId: String, backgroundColor: { type: String, default: "rgba(99,102,241,0.1)" } }, customOverrides: { type: Schema.Types.Mixed, default: {} }, isHidden: { type: Boolean, default: false } }],
  audioHindiUrl: String, audioHindiFileId: String, audioEnglishUrl: String, audioEnglishFileId: String,
  partAudios: [{ partNumber: { type: Number, required: true }, partName: String, startScene: Number, endScene: Number, audioHindiUrl: String, audioHindiFileId: String, audioEnglishUrl: String, audioEnglishFileId: String, audioDuration: Number, transcript: { segments: [{ start: Number, end: Number, text: String, slideNumber: Number }], language: { type: String, default: "hi" }, transcribedAt: Date }, manualSlideTimings: { type: Map, of: Number, default: {} } }],
  audioTranscript: { segments: [{ id: Number, start: Number, end: Number, text: String, slideNumber: Number }], language: { type: String, default: "hi" }, duration: Number, transcribedAt: Date, autoSyncEnabled: { type: Boolean, default: true } },
  manualSlideTimings: { type: Map, of: Number, default: {} },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }], likeCount: { type: Number, default: 0 }, views: { type: Number, default: 0 },
  order: { type: Number, default: 0 }, isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }, updatedAt: { type: Date, default: Date.now },
});

LearnContentSchema.index({ subject: 1, type: 1 });
LearnContentSchema.index({ subject: 1, order: 1 });
LearnContentSchema.pre("save", function (next) { this.likeCount = this.likes.length; this.updatedAt = new Date(); next(); });

const LearnContent: Model<ILearnContent> = mongoose.models.LearnContent || mongoose.model<ILearnContent>("LearnContent", LearnContentSchema);
export default LearnContent;
