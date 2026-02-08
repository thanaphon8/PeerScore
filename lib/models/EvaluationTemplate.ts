import mongoose, { Schema, Document } from 'mongoose';

export interface ICriteria {
  criteriaId: string;
  criteriaName: string;
  maxScore: number;
}

export interface ICategory {
  categoryId: string;
  categoryName: string;
  weight: number;
  criteria: ICriteria[];
}

export interface IGradeScale {
  grade: string;
  minScore: number;
  maxScore: number;
}

export interface IEvaluationTemplate extends Document {
  templateName: string;
  evaluationType: string;
  categories: ICategory[];
  totalMaxScore: number;
  passingScore: number;
  gradeScale: IGradeScale[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CriteriaSchema = new Schema<ICriteria>({
  criteriaId: { type: String, required: true },
  criteriaName: { type: String, required: true },
  maxScore: { type: Number, required: true },
});

const CategorySchema = new Schema<ICategory>({
  categoryId: { type: String, required: true },
  categoryName: { type: String, required: true },
  weight: { type: Number, required: true },
  criteria: [CriteriaSchema],
});

const GradeScaleSchema = new Schema<IGradeScale>({
  grade: { type: String, required: true },
  minScore: { type: Number, required: true },
  maxScore: { type: Number, required: true },
});

const EvaluationTemplateSchema = new Schema<IEvaluationTemplate>(
  {
    templateName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    evaluationType: {
      type: String,
      required: true,
    },
    categories: [CategorySchema],
    totalMaxScore: {
      type: Number,
      required: true,
    },
    passingScore: {
      type: Number,
      required: true,
    },
    gradeScale: [GradeScaleSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.EvaluationTemplate || mongoose.model<IEvaluationTemplate>('EvaluationTemplate', EvaluationTemplateSchema);
