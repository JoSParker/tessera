import mongoose, { Schema, Document } from 'mongoose';

export interface IEntry extends Document {
  user_id: string;
  task_id: string;
  day_index: number;
  hour: number;
  year: number;
  created_at: Date;
}

const EntrySchema: Schema = new Schema<IEntry>({
  user_id: { type: String, required: true },
  task_id: { type: String, required: true },
  day_index: { type: Number, required: true },
  hour: { type: Number, required: true },
  year: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Entry || mongoose.model<IEntry>('Entry', EntrySchema);
