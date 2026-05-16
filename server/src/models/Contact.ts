import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  kind: 'partnership' | 'hiring' | 'general';
  name: string;
  email: string;
  org?: string;
  message: string;
  status: 'new' | 'in_review' | 'replied' | 'archived';
}

const ContactSchema = new Schema<IContact>(
  {
    kind: { type: String, enum: ['partnership', 'hiring', 'general'], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    org: String,
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'in_review', 'replied', 'archived'], default: 'new' },
  },
  { timestamps: true }
);

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);
