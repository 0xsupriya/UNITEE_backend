import { ConfigFactory } from '@nestjs/config';
import { envSchema } from './env.schema';

export const validateEnv: ConfigFactory = () => {
  const parse = envSchema.safeParse(process.env);
  if (!parse.success) {
    console.error('Invalid environment variables:', parse.error.format());
    process.exit(1);
  }
  return parse.data;
};
