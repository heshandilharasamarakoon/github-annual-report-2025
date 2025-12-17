export const env = {
  PORT: Number(process.env.PORT) || 3000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID || '',
  OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET || '',
  OAUTH_REDIRECT_URI: process.env.OAUTH_REDIRECT_URI || 'http://localhost:3000/auth/callback',
  OAUTH_API_URL: process.env.OAUTH_API_URL || 'https://api.github.com/graphql',
  OAUTH_TOKEN_URL: process.env.OAUTH_TOKEN_URL || 'https://github.com/login/oauth/access_token',
  
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_API_URL: process.env.AI_API_URL || 'https://api.openai.com/v1',
  AI_MODEL: process.env.AI_MODEL || 'gpt-4o-mini',
  
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

export function validateEnv() {
  const requiredVars = [
    'OAUTH_CLIENT_ID',
    'OAUTH_CLIENT_SECRET',
  ];

  const missing = requiredVars.filter(key => !env[key as keyof typeof env]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file or environment configuration.'
    );
  }
}

