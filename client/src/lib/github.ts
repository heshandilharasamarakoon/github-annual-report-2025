import type { UserData, SlidesData, LanguageData } from '../store/useAppStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface GitHubRepo {
  name: string;
  description: string;
  stargazerCount: number;
  forkCount: number;
  url: string;
  updatedAt: string;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  languages: {
    edges: Array<{
      size: number;
      node: {
        name: string;
        color: string;
      };
    }>;
  };
}

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendarDay {
  date: string;
  count: number;
  level: number;
}

export async function fetchUserData(token: string): Promise<UserData> {
  const query = `
    query {
      viewer {
        login
        name
        avatarUrl
        bio
      }
    }
  `;

  const response = await fetch(`${API_BASE}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, token }),
  });

  const data = await response.json();
  return data.data.viewer;
}

export async function fetchGitHubStats(token: string, username: string): Promise<SlidesData> {
  const year = 2025;
  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
          pullRequestContributions {
            totalCount
          }
          pullRequestReviewContributions {
            totalCount
          }
          issueContributions {
            totalCount
          }
          commitContributionsByRepository {
            repository {
              name
              owner {
                login
              }
            }
            contributions {
              totalCount
            }
          }
        }
        repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
          totalCount
          nodes {
            name
            description
            stargazerCount
            forkCount
            url
            updatedAt
            primaryLanguage {
              name
              color
            }
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  name
                  color
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(`${API_BASE}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { username, from, to }, token }),
  });

  const data = await response.json();
  const userData = data.data.user;

  const contributions = userData.contributionsCollection;
  const totalCommits = contributions.contributionCalendar.totalContributions;
  const totalPRs = contributions.pullRequestContributions.totalCount;
  const totalReviews = contributions.pullRequestReviewContributions?.totalCount || 0;
  const totalIssues = contributions.issueContributions?.totalCount || 0;

  const repos = userData.repositories.nodes as GitHubRepo[];
  const totalRepos = userData.repositories.totalCount;
  const totalStars = repos.reduce((sum: number, repo) => sum + repo.stargazerCount, 0);
  const totalForks = repos.reduce((sum: number, repo) => sum + (repo.forkCount || 0), 0);

  const languageMap = new Map<string, { size: number; color: string }>();
  repos.forEach((repo) => {
    repo.languages.edges.forEach((edge) => {
      const name = edge.node.name;
      const existing = languageMap.get(name) || { size: 0, color: edge.node.color };
      languageMap.set(name, {
        size: existing.size + edge.size,
        color: edge.node.color,
      });
    });
  });

  const totalSize = Array.from(languageMap.values()).reduce((sum, lang) => sum + lang.size, 0);
  const topLanguages: LanguageData[] = Array.from(languageMap.entries())
    .map(([name, data]) => ({
      name,
      percentage: (data.size / totalSize) * 100,
      color: data.color || '#8b5cf6',
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  const contributionDays: ContributionCalendarDay[] = (contributions.contributionCalendar.weeks as ContributionWeek[]).flatMap((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: Math.min(Math.floor(day.contributionCount / 3), 4),
    }))
  );

  const busiestDay = contributionDays.reduce((max, day) =>
    day.count > max.count ? day : max
  , { date: '', count: 0 });

  const persona = calculatePersona(contributionDays);

  const radarData: Array<{ subject: string; value: number; fullMark: 100 }> = [
    { subject: '代码量', value: Math.min((totalCommits / 500) * 100, 100), fullMark: 100 as const },
    { subject: '活跃度', value: Math.min((contributionDays.filter((d) => d.count > 0).length / 365) * 100, 100), fullMark: 100 as const },
    { subject: '协作力', value: Math.min((totalPRs / 50) * 100, 100), fullMark: 100 as const },
    { subject: '影响力', value: Math.min((totalStars / 100) * 100, 100), fullMark: 100 as const },
    { subject: '多样性', value: Math.min((topLanguages.length / 5) * 100, 100), fullMark: 100 as const },
    { subject: '创造力', value: Math.min((totalRepos / 20) * 100, 100), fullMark: 100 as const },
  ];

  const activeDays = contributionDays.filter((d) => d.count > 0).length;
  
  let longestStreak = 0;
  let currentStreak = 0;
  contributionDays.forEach((day) => {
    if (day.count > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  const averageCommitsPerDay = activeDays > 0 ? totalCommits / activeDays : 0;

  const topRepositories = repos
    .filter(repo => repo.stargazerCount > 0)
    .slice(0, 5)
    .map(repo => ({
      name: repo.name,
      description: repo.description || '',
      stargazerCount: repo.stargazerCount,
      forkCount: repo.forkCount || 0,
      language: repo.primaryLanguage?.name || 'Unknown',
      updatedAt: repo.updatedAt,
      url: repo.url,
    }));

  const commitsByMonth = new Map<string, number>();
  contributionDays.forEach(day => {
    const month = day.date.substring(0, 7);
    commitsByMonth.set(month, (commitsByMonth.get(month) || 0) + day.count);
  });

  const commitActivity = Array.from(commitsByMonth.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const aiCommentRes = await fetch(`${API_BASE}/ai-comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      persona,
      style: 'warm',
      stats: {
        totalCommits,
        totalPRs,
        totalStars,
        totalRepos,
        busiestDay,
        topLanguages: topLanguages.slice(0, 5),
        activeDays,
        longestStreak,
        averageCommitsPerDay,
        radarData,
        topRepositories,
        commitActivity,
        totalForks,
        totalIssues,
        totalReviews,
      }
    }),
  });
  const { comment } = await aiCommentRes.json();

  return {
    totalCommits,
    totalPRs,
    totalStars,
    totalRepos,
    topLanguages,
    busiestDay,
    persona,
    radarData,
    contributionCalendar: contributionDays,
    aiComment: comment,
    topRepositories,
    commitActivity,
    totalForks,
    totalIssues,
    totalReviews,    activeDays,
    longestStreak,
    averageCommitsPerDay,  };
}

function calculatePersona(contributionDays: ContributionCalendarDay[]): string {
  const weekendCount = contributionDays.filter((day) => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    return (dayOfWeek === 0 || dayOfWeek === 6) && day.count > 0;
  }).length;

  const activeDays = contributionDays.filter(d => d.count > 0);
  if (activeDays.length === 0) return 'default';

  const avgPerDay = activeDays.reduce((sum, d) => sum + d.count, 0) / activeDays.length;
  const consistency = activeDays.length / 365;

  if (weekendCount > 50) return 'weekend-warrior';
  if (consistency > 0.7) return 'consistent-contributor';
  if (avgPerDay > 5) return 'night-owl';
  return 'early-bird';
}

