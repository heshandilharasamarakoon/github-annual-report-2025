import axios from 'axios';
import { env } from '../utils/env';
import { logger } from '../utils/logger';
import type { GitHubOAuthTokenResponse } from '../types';

export class GitHubService {
  static async exchangeCodeForToken(code: string): Promise<string> {
    try {
      const response = await axios.post<GitHubOAuthTokenResponse>(
        env.OAUTH_TOKEN_URL,
        {
          client_id: env.OAUTH_CLIENT_ID,
          client_secret: env.OAUTH_CLIENT_SECRET,
          code,
          redirect_uri: env.OAUTH_REDIRECT_URI,
        },
        {
          headers: { Accept: 'application/json' },
        }
      );

      if (!response.data.access_token) {
        throw new Error('No access token in response');
      }

      return response.data.access_token;
    } catch (error: any) {
      logger.error('Failed to exchange code for token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with GitHub');
    }
  }

  static async queryGraphQL(query: string, variables: any, token: string): Promise<any> {
    try {
      const response = await axios.post(
        env.OAUTH_API_URL,
        { query, variables },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.errors) {
        logger.error('GitHub GraphQL errors:', response.data.errors);
        throw new Error(response.data.errors[0]?.message || 'GraphQL query failed');
      }

      return response.data;
    } catch (error: any) {
      logger.error('GitHub GraphQL request failed:', error.response?.data || error.message);
      throw error;
    }
  }
}

