import { Elysia } from 'elysia';
import { env } from '../utils/env';
import { logger } from '../utils/logger';
import { GitHubService } from '../services/github';
import type { ErrorResponse } from '../types';

export const authRoutes = new Elysia({ prefix: '/auth' })
  .get('/github', ({ set, redirect }) => {
    if (!env.OAUTH_CLIENT_ID) {
      logger.error('OAUTH_CLIENT_ID is not configured');
      set.status = 500;
      return { error: 'GitHub OAuth is not configured properly' } as ErrorResponse;
    }

    const params = new URLSearchParams({
      client_id: env.OAUTH_CLIENT_ID,
      redirect_uri: env.OAUTH_REDIRECT_URI,
      scope: 'read:user user:email',
    });

    const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
    
    logger.info(`Redirecting to GitHub OAuth: ${authUrl.replace(env.OAUTH_CLIENT_ID, 'CLIENT_ID_HIDDEN')}`);
    
    return redirect(authUrl, 302);
  })
  
  .get('/callback', async ({ query, set, redirect }) => {
    const { code } = query;
    
    if (!code || typeof code !== 'string') {
      set.status = 400;
      logger.warn('OAuth callback received without code');
      return { error: 'No authorization code provided' } as ErrorResponse;
    }

    try {
      logger.info('Exchanging OAuth code for token');
      const accessToken = await GitHubService.exchangeCodeForToken(code);
      
      const redirectUrl = `${env.CORS_ORIGIN}?token=${accessToken}`;
      logger.info('OAuth successful, redirecting to frontend');
      
      return redirect(redirectUrl, 302);
    } catch (error: any) {
      logger.error('OAuth callback failed:', error);
      set.status = 500;
      return { error: error.message || 'Failed to authenticate with GitHub' } as ErrorResponse;
    }
  });
