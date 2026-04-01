import { z } from 'zod';

export const envSchema = z.object({
  // Server
  PORT: z.coerce.number().default(5001),

  // Database
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  // JWT
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('30d'),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_BUCKET: z.string().optional(),

  // SMTP
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASS: z.string().optional(),

  // Features
  AUTO_MIGRATE: z.coerce.boolean().default(false),
});

export type Env = z.infer<typeof envSchema>;
