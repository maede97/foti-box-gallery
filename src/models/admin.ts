import bcrypt from 'bcrypt';
import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  password: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Compare password method
AdminSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
