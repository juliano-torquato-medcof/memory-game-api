import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

export interface Ranking extends Document {
  name: string;
  score: number;
  firstFound: string;
  lastFound: string;
  createdAt: Date;
}

export const RankingSchemaZod = z.object({
  name: z.string().min(1),
  score: z.number().positive(),
  firstFound: z.string(),
  lastFound: z.string(),
});

const RankingSchema = new Schema<Ranking>({
  name: { type: String, required: true },
  score: { type: Number, required: true },
  firstFound: { type: String, required: true },
  lastFound: { type: String, required: true },
}, {
  collection: 'rankings',
  timestamps: { createdAt: true, updatedAt: false },
});

RankingSchema.index({ score: 1, createdAt: -1 });
RankingSchema.index({ name: 1, createdAt: -1 });

export const RankingModel = mongoose.model<Ranking>('Ranking', RankingSchema); 