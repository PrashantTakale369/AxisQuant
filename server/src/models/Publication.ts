import mongoose, { Document, Schema } from 'mongoose';

export interface IPublication extends Document {
  kind: 'research' | 'blog';
  title: string;
  slug: string;
  abstract?: string;
  content: string;
  authors: { name: string; handle?: string }[];
  topics: string[];
  publishedAt: Date;
  featured: boolean;
  draft: boolean;
  coverImage?: string;
  arxivUrl?: string;
  githubUrl?: string;
  hfPaperUrl?: string;
  readingTime?: number;
}

const PublicationSchema = new Schema<IPublication>(
  {
    kind: { type: String, enum: ['research', 'blog'], required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    abstract: String,
    content: { type: String, required: true },
    authors: [{ name: { type: String, required: true }, handle: String }],
    topics: [String],
    publishedAt: { type: Date, default: Date.now },
    featured: { type: Boolean, default: false },
    draft: { type: Boolean, default: false },
    coverImage: String,
    arxivUrl: String,
    githubUrl: String,
    hfPaperUrl: String,
    readingTime: Number,
  },
  { timestamps: true }
);

PublicationSchema.index({ kind: 1, publishedAt: -1 });
PublicationSchema.index({ slug: 1 });
PublicationSchema.index({ topics: 1 });

export const Publication = mongoose.model<IPublication>('Publication', PublicationSchema);
