declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AI_API_KEY: string;
      STRIPE_API_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

export {} 