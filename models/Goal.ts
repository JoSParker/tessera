import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  user_id: string;
  title: string;
  category?: string;
  progress: number;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

const GoalSchema: Schema = new Schema<IGoal>({
  user_id: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String },
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

GoalSchema.pre('save', function () {
  this.updated_at = new Date();
});

export default mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);
