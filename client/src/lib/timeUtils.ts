const YEAR_2025_START = new Date('2025-01-01T00:00:00Z');
const YEAR_2025_END = new Date('2025-12-31T23:59:59Z');

export function getDaysElapsedIn2025(): number {
  const now = new Date();
  if (now < YEAR_2025_START) return 0;
  if (now > YEAR_2025_END) return 365;
  
  const diff = now.getTime() - YEAR_2025_START.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

export function getDaysRemainingIn2025(): number {
  const now = new Date();
  if (now > YEAR_2025_END) return 0;
  if (now < YEAR_2025_START) return 365;
  
  const diff = YEAR_2025_END.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getCurrentYearProgress(): number {
  const daysElapsed = getDaysElapsedIn2025();
  return Math.min((daysElapsed / 365) * 100, 100);
}

export function is2025Complete(): boolean {
  return new Date() > YEAR_2025_END;
}

export function getQuarter(date: string | Date): 1 | 2 | 3 | 4 {
  const d = typeof date === 'string' ? new Date(date) : date;
  const month = d.getMonth() + 1;
  if (month <= 3) return 1;
  if (month <= 6) return 2;
  if (month <= 9) return 3;
  return 4;
}

export function getQuarterName(quarter: 1 | 2 | 3 | 4): string {
  const names = ['', 'Q1', 'Q2', 'Q3', 'Q4'];
  return names[quarter];
}

export function getQuarterDateRange(quarter: 1 | 2 | 3 | 4): { start: string; end: string } {
  const ranges = {
    1: { start: '2025-01-01', end: '2025-03-31' },
    2: { start: '2025-04-01', end: '2025-06-30' },
    3: { start: '2025-07-01', end: '2025-09-30' },
    4: { start: '2025-10-01', end: '2025-12-31' },
  };
  return ranges[quarter];
}

export function get2025Milestones(): Array<{ date: string; name: string; emoji: string }> {
  return [
    { date: '2025-01-01', name: '新年伊始', emoji: '🎉' },
    { date: '2025-02-10', name: '春节', emoji: '🧧' },
    { date: '2025-05-01', name: '劳动节', emoji: '👷' },
    { date: '2025-10-01', name: '国庆节', emoji: '🇨🇳' },
    { date: '2025-12-31', name: '年终', emoji: '🎊' },
  ];
}

export function getMonthName(month: number): string {
  const names = [
    '', '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];
  return names[month] || '';
}

export function getProgressText(): string {
  const progress = getCurrentYearProgress();
  const daysRemaining = getDaysRemainingIn2025();
  
  if (is2025Complete()) {
    return '2025年已完美收官';
  }
  
  if (daysRemaining > 0) {
    return `距离2025年结束还有 ${daysRemaining} 天`;
  }
  
  return `2025年进度：${progress.toFixed(1)}%`;
}

