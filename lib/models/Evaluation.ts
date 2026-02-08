import mongoose, { Schema, Document } from 'mongoose';

export interface IEvaluation extends Document {
  projectId: string;
  evaluatorId: string;
  evaluationType: 'advisor' | 'committee' | 'peer';
  evaluationDate: Date;
  scores: {
    content: {
      clarity: number;
      completeness: number;
      relevance: number;
      innovation: number;
      subtotal: number;
      maxScore: number;
    };
    technical: {
      design: number;
      implementation: number;
      testing: number;
      documentation: number;
      subtotal: number;
      maxScore: number;
    };
    presentation: {
      delivery: number;
      visualAids: number;
      answeringQuestions: number;
      timeManagement: number;
      subtotal: number;
      maxScore: number;
    };
  };
  totalScore: number;
  maxTotalScore: number;
  percentage: number;
  grade: string;
  comments: string;
  strengths: string[];
  improvements: string[];
  status: 'pending' | 'completed' | 'revised';
  createdAt: Date;
  updatedAt: Date;
}

const EvaluationSchema = new Schema<IEvaluation>(
  {
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    evaluatorId: {
      type: String,
      required: true,
      index: true,
    },
    evaluationType: {
      type: String,
      enum: ['advisor', 'committee', 'peer'],
      required: true,
    },
    evaluationDate: {
      type: Date,
      required: true,
    },
    scores: {
      content: {
        clarity: { type: Number, required: true },
        completeness: { type: Number, required: true },
        relevance: { type: Number, required: true },
        innovation: { type: Number, required: true },
        subtotal: { type: Number, required: true },
        maxScore: { type: Number, default: 40 },
      },
      technical: {
        design: { type: Number, required: true },
        implementation: { type: Number, required: true },
        testing: { type: Number, required: true },
        documentation: { type: Number, required: true },
        subtotal: { type: Number, required: true },
        maxScore: { type: Number, default: 40 },
      },
      presentation: {
        delivery: { type: Number, required: true },
        visualAids: { type: Number, required: true },
        answeringQuestions: { type: Number, required: true },
        timeManagement: { type: Number, required: true },
        subtotal: { type: Number, required: true },
        maxScore: { type: Number, default: 40 },
      },
    },
    totalScore: {
      type: Number,
      required: true,
    },
    maxTotalScore: {
      type: Number,
      default: 120,
    },
    percentage: {
      type: Number,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    comments: {
      type: String,
      required: true,
    },
    strengths: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'revised'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Evaluation || mongoose.model<IEvaluation>('Evaluation', EvaluationSchema);
