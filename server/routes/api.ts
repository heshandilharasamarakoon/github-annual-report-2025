import { Elysia } from 'elysia';
import { logger } from '../utils/logger';
import { GitHubService } from '../services/github';
import { AIService } from '../services/ai';
import { env } from '../utils/env';
import type { GitHubGraphQLRequest, AICommentRequest, AICommentResponse, ErrorResponse } from '../types';

export const apiRoutes = new Elysia({ prefix: '/api' })
  .get('/health', () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'github-annual-report-api'
    };
  })

  .get('/auth/github', ({ set }) => {
    logger.info('Redirecting to GitHub OAuth');

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

    set.status = 302;
    set.headers = {
      'Location': authUrl,
      'Cache-Control': 'no-cache',
    };

    return '';
  })

  .get('/auth/callback', async ({ query, set }) => {
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

      set.status = 302;
      set.headers = {
        'Location': redirectUrl,
        'Cache-Control': 'no-cache',
      };

      return '';
    } catch (error: any) {
      logger.error('OAuth callback failed:', error);
      set.status = 500;
      return { error: error.message || 'Failed to authenticate with GitHub' } as ErrorResponse;
    }
  })

  .post('/graphql', async ({ body, set }) => {
    const { query, variables, token } = body as GitHubGraphQLRequest;

    if (!token) {
      set.status = 401;
      logger.warn('GraphQL request without token');
      return { error: 'Authentication token required' } as ErrorResponse;
    }

    if (!query) {
      set.status = 400;
      logger.warn('GraphQL request without query');
      return { error: 'GraphQL query required' } as ErrorResponse;
    }

    try {
      logger.debug('Executing GitHub GraphQL query');
      const data = await GitHubService.queryGraphQL(query, variables, token);
      return data;
    } catch (error: any) {
      logger.error('GraphQL query failed:', error);
      set.status = error.response?.status || 500;
      return { error: error.message || 'Failed to query GitHub API' } as ErrorResponse;
    }
  })

  .post('/ai-comment', async ({ body, set }) => {
    const request = body as AICommentRequest;

    if (!request.persona) {
      set.status = 400;
      logger.warn('AI comment request without persona');
      return { error: 'Persona required' } as ErrorResponse;
    }

    try {
      logger.debug(`Generating AI comment for persona: ${request.persona}`);
      const comment = await AIService.generateComment(request);
      
      const response: AICommentResponse = { comment };
      return response;
    } catch (error: any) {
      logger.error('AI comment generation failed:', error);
      set.status = 500;
      return { error: 'Failed to generate comment' } as ErrorResponse;
    }
  })

  .post('/ai-comment/stream', async ({ body, set }) => {
    const request = body as AICommentRequest;

    if (!request.persona) {
      set.status = 400;
      return { error: 'Persona required' };
    }

    set.headers['Content-Type'] = 'text/event-stream';
    set.headers['Cache-Control'] = 'no-cache';
    set.headers['Connection'] = 'keep-alive';

    return AIService.generateCommentStream(request.persona, request.style, request.stats);
  })

  .post('/ai-analysis/stream', async ({ body, set }) => {
    try {
      const { commits, repositories, style } = body as {
        commits: Array<{ message: string; date: string }>;
        repositories: Array<{ name: string; description: string; language: string; commits2025: number; stargazerCount: number; recentCommits: Array<{ message: string }> }>;
        style?: string;
      };

      if (!commits || !repositories) {
        set.status = 400;
        logger.warn('AI analysis request without commits or repositories');
        return { error: 'Commits and repositories required' };
      }

      set.headers['Content-Type'] = 'text/event-stream';
      set.headers['Cache-Control'] = 'no-cache';
      set.headers['Connection'] = 'keep-alive';

      const stream = new ReadableStream({
        async start(controller) {
          try {
            const generator = AIService.generateAnalysisStream(commits, repositories, style);
            for await (const chunk of generator) {
              controller.enqueue(new TextEncoder().encode(chunk));
            }
            controller.close();
          } catch (error: any) {
            logger.error('Stream error:', error);
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } catch (error: any) {
      logger.error('AI analysis stream setup failed:', error);
      set.status = 500;
      return { error: error.message || 'Failed to setup stream' };
    }
  });

