import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

export const StatsSchemaZod = z.object({
  value: z.string(),
  firstCount: z.number().int().nonnegative(),
  lastCount: z.number().int().nonnegative(),
  createdAt: z.date().optional()
});

export type Stats = z.infer<typeof StatsSchemaZod> & Document;

const StatCountSchema = z.object({
  value: z.string(),
  firstCount: z.number().int().nonnegative().optional(),
  lastCount: z.number().int().nonnegative().optional()
});

export const StatsOverviewSchema = z.object({
  mostFirstFound: z.array(StatCountSchema),
  leastFirstFound: z.array(StatCountSchema),
  mostLastFound: z.array(StatCountSchema),
  leastLastFound: z.array(StatCountSchema),
  totalCards: z.number().int().nonnegative(),
  totalFirstFinds: z.number().int().nonnegative(),
  totalLastFinds: z.number().int().nonnegative()
});

export type StatsOverview = z.infer<typeof StatsOverviewSchema>;

const StatsSchema = new Schema<Stats>({
  value: { type: String, required: true, unique: true },
  firstCount: { type: Number, required: true, default: 0 },
  lastCount: { type: Number, required: true, default: 0 },
}, {
  collection: 'stats',
  timestamps: { createdAt: true, updatedAt: false },
});

StatsSchema.index({ firstCount: -1 });
StatsSchema.index({ lastCount: -1 });

export const StatsModel = mongoose.model<Stats>('Stats', StatsSchema); 