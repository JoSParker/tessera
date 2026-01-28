import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  full_name?: string;
  avatar_url?: string;
  password?: string; // Only for local auth
  created_at: Date;
  updated_at: Date;
}

const UserSchema: Schema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  full_name: { type: String },
  avatar_url: { type: String },
  password: { type: String }, // Hashed password for local auth
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

UserSchema.pre('save', function (this: any) {
  this.updated_at = new Date();
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
