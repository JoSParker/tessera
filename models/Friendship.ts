import mongoose, { Schema, Document } from 'mongoose';

export interface IFriendship extends Document {
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  created_at: Date;
  updated_at: Date;
}

const FriendshipSchema: Schema = new Schema<IFriendship>({
  requester_id: { type: String, required: true },
  addressee_id: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined', 'blocked'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

FriendshipSchema.pre('save', function () {
  this.updated_at = new Date();
});

export default mongoose.models.Friendship || mongoose.model<IFriendship>('Friendship', FriendshipSchema);
