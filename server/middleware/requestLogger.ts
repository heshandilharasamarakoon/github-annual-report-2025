import { Elysia } from 'elysia';
import { logger } from '../utils/logger';

export const requestLogger = new Elysia()
  .derive(({ request }) => {
    const startTime = Date.now();
    return { startTime };
  })
  .onRequest(({ request }) => {
    logger.info(`→ ${request.method} ${new URL(request.url).pathname}`);
  })
  .onAfterResponse(({ request, set }) => {
    const pathname = new URL(request.url).pathname;
    const method = request.method;
    const status = Number(set.status) || 200;
    const logFn = status >= 400 ? logger.error : logger.info;
    logFn(`← ${method} ${pathname} - ${status}`);
  });

