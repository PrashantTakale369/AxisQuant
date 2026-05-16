import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  handle: string;
  title: string;
  bio: string;
  photoUrl?: string;
  focusAreas: string[];
  links: { github?: string; hf?: string; scholar?: string; twitter?: string; website?: string };
  orderIndex: number;
  isActive: boolean;
}

const TeamSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true },
    handle: { type: String, required: true, unique: true, lowercase: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    photoUrl: String,
    focusAreas: [String],
    links: {
      github: String,
      hf: String,
      scholar: String,
      twitter: String,
      website: String,
    },
    orderIndex: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const TeamMember = mongoose.model<ITeamMember>('TeamMember', TeamSchema);
