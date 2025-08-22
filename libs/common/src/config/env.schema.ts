import z from 'zod';
export const envSchema = z.object({
    PORT : z.coerce.number().default(4000),
    DATABASE_URL : z.string(),
    JWT_SECRET : z.string().default('your-secret-key')
})
export type envSchema = z.infer<typeof envSchema>;
