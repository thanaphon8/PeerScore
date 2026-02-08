import mongoose, { Schema, Document } from 'mongoose';

export interface IEvaluator extends Document {
  evaluatorId: string;
  title: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  email: string;
  createdAt: Date;
}

const EvaluatorSchema = new Schema<IEvaluator>(
  {
    evaluatorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Evaluator || mongoose.model<IEvaluator>('Evaluator', EvaluatorSchema);
