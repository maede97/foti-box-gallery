import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const environmentVariables = createEnv({
  server: {
    INIT_ADMIN_USERNAME: z.string(),
    INIT_ADMIN_PW: z.string(),
    MONGO_URI: z.url(),
    UPLOAD_FOLDER: z.string(),
    JWT_SECRET: z.string(),
  },
  client: {},
  experimental__runtimeEnv: {},
  emptyStringAsUndefined: true,

  skipValidation: process.env['BUILD_TARGET'] === 'production',
});
