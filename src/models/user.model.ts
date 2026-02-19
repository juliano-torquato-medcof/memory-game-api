import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

export interface User extends Document {
  email: string;
  password: string;
  displayName?: string;
  createdAt: Date;
}

export const UserSchemaZod = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(1).max(100).optional(),
});

const UserSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    displayName: { type: String },
  },
  {
    collection: 'users',
    timestamps: { createdAt: true, updatedAt: false },
  }
);

UserSchema.index({ email: 1 }, { unique: true });

export const UserModel = mongoose.model<User>('User', UserSchema);
