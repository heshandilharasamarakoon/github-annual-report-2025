import { Elysia } from 'elysia';
import { logger } from '../utils/logger';
import type { ErrorResponse } from '../types';

export const errorHandler = new Elysia()
  .onError(({ code, error, set }) => {
    logger.error(`Error [${code}]:`, error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    
    const response: ErrorResponse = {
      error: errorMessage || 'Internal server error',
      code: String(code),
    };

    switch (code) {
      case 'NOT_FOUND':
        set.status = 404;
        response.error = 'Resource not found';
        break;
      case 'VALIDATION':
        set.status = 400;
        response.error = 'Validation error';
        break;
      case 'PARSE':
        set.status = 400;
        response.error = 'Invalid request format';
        break;
      default:
        set.status = 500;
    }

    return response;
  });

