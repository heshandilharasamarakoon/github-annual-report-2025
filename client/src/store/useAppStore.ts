import { create } from 'zustand';

export interface UserData {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
}

export interface LanguageData {
  name: string;
  percentage: number;
  color: string;
}

export interface RepositoryInfo {
  name: string;
  description: string;
  stargazerCount: number;
  forkCount: number;
  language: string;
  updatedAt: string;
  url: string;
}

export interface CommitActivity {
  month: string;
  count: number;
}

export interface SlidesData {
  totalCommits: number;
  totalPRs: number;
  totalStars: number;
  totalRepos: number;
  topLanguages: LanguageData[];
  busiestDay: { date: string; count: number };
  persona: string;
  radarData: Array<{ subject: string; value: number; fullMark: 100 }>;
  contributionCalendar: Array<{ date: string; count: number; level: number }>;
  aiComment: string;
  topRepositories: RepositoryInfo[];
  commitActivity: CommitActivity[];
  totalForks: number;
  totalIssues: number;
  totalReviews: number;
  activeDays: number;
  longestStreak: number;
  averageCommitsPerDay: number;
}

interface AppState {
  token: string | null;
  userData: UserData | null;
  slidesData: SlidesData | null;
  currentSlide: number;
  isLoading: boolean;
  setToken: (token: string) => void;
  setUserData: (data: UserData) => void;
  setSlidesData: (data: SlidesData) => void;
  setCurrentSlide: (slide: number) => void;
  setLoading: (loading: boolean) => void;
  updateAIComment: (comment: string) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  token: null,
  userData: null,
  slidesData: null,
  currentSlide: 0,
  isLoading: false,
  setToken: (token) => set({ token }),
  setUserData: (data) => set({ userData: data }),
  setSlidesData: (data) => set({ slidesData: data }),
  setCurrentSlide: (slide) => set({ currentSlide: slide }),
  setLoading: (loading) => set({ isLoading: loading }),
  updateAIComment: (comment) => set((state) => ({
    slidesData: state.slidesData ? { ...state.slidesData, aiComment: comment } : null
  })),
  reset: () => set({ token: null, userData: null, slidesData: null, currentSlide: 0 }),
}));

