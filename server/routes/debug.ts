import { Elysia } from 'elysia';
import { env } from '../utils/env';

export const debugRoutes = new Elysia({ prefix: '/debug' })
  .get('/config', () => {
    return {
      hasClientId: !!env.OAUTH_CLIENT_ID,
      hasClientSecret: !!env.OAUTH_CLIENT_SECRET,
      redirectUri: env.OAUTH_REDIRECT_URI,
      corsOrigin: env.CORS_ORIGIN,
      oauthApiUrl: env.OAUTH_API_URL,
      oauthTokenUrl: env.OAUTH_TOKEN_URL,
      hasAiKey: !!env.AI_API_KEY,
      environment: env.NODE_ENV,
    };
  })
  
  .get('/test-auth', ({ set }) => {
    if (!env.OAUTH_CLIENT_ID) {
      set.status = 500;
      return { error: 'OAUTH_CLIENT_ID is not set in environment variables' };
    }

    const params = new URLSearchParams({
      client_id: env.OAUTH_CLIENT_ID,
      redirect_uri: env.OAUTH_REDIRECT_URI,
      scope: 'read:user user:email',
    });

    return {
      message: 'OAuth URL constructed successfully',
      url: `https://github.com/login/oauth/authorize?${params.toString()}`,
      clientIdLength: env.OAUTH_CLIENT_ID.length,
      redirectUri: env.OAUTH_REDIRECT_URI,
    };
  });

