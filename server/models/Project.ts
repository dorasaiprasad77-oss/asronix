import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  projectName: string;
  images: string[];
  description: string;
  technologies: string[];
  clientIndustry: string;
  projectUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    projectName: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String, required: true },
    technologies: [{ type: String }],
    clientIndustry: { type: String, required: true },
    projectUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
