import mongoose, { Document, Schema } from 'mongoose';

export interface IBox extends Document {
  label: string;
  accessToken: string;
  lastUpload?: Date;
  active?: boolean;
}

const BoxSchema = new Schema<IBox>({
  label: { type: String, required: true },
  accessToken: { type: String, required: true },
  lastUpload: { type: Date },
  active: { type: Boolean, default: true },
});

export default mongoose.models.Box || mongoose.model<IBox>('Box', BoxSchema);
