import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  slug: string;
  password: string;
  active: boolean;
  allow_user_uploads: boolean;
  allow_download: boolean;
  logo: string | undefined;
}

const EventSchema = new Schema<IEvent>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  password: { type: String, required: false, default: '' },
  active: { type: Boolean, default: false },
  allow_user_uploads: { type: Boolean, default: false },
  allow_download: { type: Boolean, default: true },
  logo: { type: String, required: false },
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
