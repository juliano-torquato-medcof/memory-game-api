import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
  PORT: z.string().transform(Number).pipe(z.number().positive()).default('3000'),
  MONGO_URL: z.string().min(1, 'MongoDB URL is required'),
  API_URL: z.string().url().optional().default('http://localhost'),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.'));
      console.error('❌ Invalid environment variables:', missingVars);
      throw new Error('Invalid environment configuration');
    }
    throw error;
  }
};

export const env = parseEnv(); 