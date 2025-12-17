import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import { authRoutes } from './routes/auth';
import { apiRoutes } from './routes/api';
import { debugRoutes } from './routes/debug';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { env, validateEnv } from './utils/env';
import { logger } from './utils/logger';

try {
  validateEnv();
  logger.info('Environment variables validated successfully');
} catch (error: any) {
  logger.error('Environment validation failed:', error.message);
  process.exit(1);
}

const app = new Elysia()
  .use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }))
  .use(requestLogger)
  .use(errorHandler)
  .use(authRoutes)
  .use(apiRoutes)
  .use(debugRoutes)
  .use(staticPlugin({
    assets: './public',
    prefix: '/',
  }))
  .get('*', async ({ request }) => {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api') && !url.pathname.startsWith('/auth')) {
      const file = Bun.file('./public/index.html');
      return new Response(file, {
        headers: { 'Content-Type': 'text/html' },
      });
    }
  })
  .listen(env.PORT);

logger.info(`🚀 Server running at ${app.server?.hostname}:${app.server?.port}`);
logger.info(`📡 CORS enabled for: ${env.CORS_ORIGIN}`);
logger.info(`🔐 GitHub OAuth configured: ${env.OAUTH_CLIENT_ID ? '✓' : '✗'}`);
logger.info(`🤖 AI Service configured: ${env.AI_API_KEY ? '✓' : '✗ (using fallback)'}`);
logger.info(`🌍 Environment: ${env.NODE_ENV}`);

export type App = typeof app;
