import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  projectTitle: string;
  projectType: string;
  studentIds: string[];
  advisorId: string;
  academicYear: string;
  semester: number;
  status: 'planning' | 'development' | 'testing' | 'completed';
  submittedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    projectTitle: {
      type: String,
      required: true,
      index: true,
    },
    projectType: {
      type: String,
      required: true,
      enum: ['Software Development', 'Hardware Development', 'Research', 'Other'],
    },
    studentIds: {
      type: [String],
      required: true,
      index: true,
    },
    advisorId: {
      type: String,
      required: true,
      index: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 2,
    },
    status: {
      type: String,
      enum: ['planning', 'development', 'testing', 'completed'],
      default: 'planning',
    },
    submittedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
