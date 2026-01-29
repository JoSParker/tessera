import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  user_id: string;
  name: string;
  color?: string;
  shortcut?: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

const TaskSchema: Schema = new Schema<ITask>({
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String },
  shortcut: { type: String },
  is_default: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

TaskSchema.pre('save', function () {
  this.updated_at = new Date();
});

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
