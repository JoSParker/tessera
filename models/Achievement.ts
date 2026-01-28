import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  user_id: string;
  achievement_key: string;
  unlocked_at: Date;
}

const AchievementSchema: Schema = new Schema<IAchievement>({
  user_id: { type: String, required: true },
  achievement_key: { type: String, required: true },
  unlocked_at: { type: Date, default: Date.now },
});

export default mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema);
