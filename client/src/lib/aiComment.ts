const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export type AICommentStyle = 'zako' | 'tsundere' | 'wholesome' | 'praise';

export interface AICommentStats {
  totalCommits: number;
  totalPRs: number;
  totalStars: number;
  totalRepos: number;
  totalForks?: number;
  totalIssues?: number;
  totalReviews?: number;
  busiestDay: { date: string; count: number };
  topLanguages: Array<{ name: string; percentage: number; color: string }>;
  activeDays: number;
  longestStreak: number;
  averageCommitsPerDay: number;
  radarData: Array<{ subject: string; value: number }>;
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
}

export async function generateAIComment(
  persona: string,
  style: AICommentStyle,
  stats: AICommentStats
): Promise<string> {
  const response = await fetch(`${API_BASE}/ai-comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ persona, style, stats }),
  });

  const data = await response.json();
  return data.comment;
}

