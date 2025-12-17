export interface GitHubOAuthTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export interface GitHubGraphQLRequest {
  query: string;
  variables?: Record<string, any>;
  token: string;
}

export type AICommentStyle = 'warm' | 'sarcastic' | 'cutie' | 'poetic';

export interface AICommentRequest {
  persona: string;
  style?: AICommentStyle;
  stats?: {
    totalCommits: number;
    totalPRs: number;
    totalStars: number;
    totalRepos: number;
    totalForks?: number;
    totalIssues?: number;
    totalReviews?: number;
    busiestDay: {
      date: string;
      count: number;
    };
    topLanguages: Array<{
      name: string;
      percentage: number;
      color?: string;
    }>;
    activeDays?: number;
    longestStreak?: number;
    averageCommitsPerDay?: number;
    radarData?: Array<{
      subject: string;
      value: number;
    }>;
    topRepositories?: Array<{
      name: string;
      description: string;
      stargazerCount: number;
      forkCount: number;
      language: string;
    }>;
    commitActivity?: Array<{
      month: string;
      count: number;
    }>;
  };
}

export interface AICommentResponse {
  comment: string;
}

export interface ErrorResponse {
  error: string;
  code?: string;
}

