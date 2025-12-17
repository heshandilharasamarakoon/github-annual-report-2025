import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { ActivityCalendar } from 'react-activity-calendar';
import { useMemo } from 'react';

export function HeatmapSlide() {
  const { slidesData } = useAppStore();

  const calendarData = useMemo(() =>
    slidesData?.contributionCalendar.map((day) => ({
      date: day.date,
      count: day.count,
      level: day.level,
    })) || [], [slidesData?.contributionCalendar]
  );

  if (!slidesData) return null;

  const theme = {
    light: ['#0a0a0a', '#0d4d2f', '#10b981', '#34d399', '#6ee7b7'],
    dark: ['#0a0a0a', '#0d4d2f', '#10b981', '#34d399', '#6ee7b7'],
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 pb-20">
      <div className="max-w-7xl w-full mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12"
        >
          你的 <span className="neon-green neon-glow">活跃热力图</span>
        </motion.h2>

        {/* Mobile Layout - Vertical Calendar */}
        <div className="md:hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6"
          >
            <MobileHeatmap calendarData={calendarData} />
          </motion.div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 flex justify-center"
          >
            <ActivityCalendar
              data={calendarData}
              theme={theme}
              colorScheme="dark"
              blockSize={14}
              blockMargin={4}
              fontSize={14}
              showWeekdayLabels
              labels={{
                totalCount: '{{count}} 次贡献在 2025',
              }}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-400 mt-6 md:mt-8 space-y-2"
        >
          <p className="text-sm md:text-base">
            你在 2025 年共有{' '}
            <span className="text-[#10b981] font-bold text-lg font-mono">
              {slidesData.contributionCalendar.filter((d) => d.count > 0).length}
            </span>{' '}
            天有代码贡献
          </p>
          <p className="text-xs md:text-sm text-gray-500">
            最长连续贡献: <span className="font-mono">{calculateLongestStreak(slidesData.contributionCalendar)}</span> 天
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function calculateLongestStreak(calendar: Array<{ date: string; count: number; level: number }>): number {
  let maxStreak = 0;
  let currentStreak = 0;

  calendar.forEach((day) => {
    if (day.count > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  return maxStreak;
}

function getContributionColor(level: number): string {
  const colors = [
    '#1a1a1a', // 0: no contributions
    '#0d4d2f', // 1: light
    '#10b981', // 2: medium
    '#34d399', // 3: high
    '#6ee7b7'  // 4: very high
  ];
  return colors[level] || colors[0];
}

function MobileHeatmap({ calendarData }: { calendarData: Array<{ date: string; count: number; level: number }> }) {
  const months = useMemo(() => {
    const monthNames = [
      '一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'
    ];

    return monthNames.map((monthName, monthIndex) => {
      const monthDays = calendarData.filter(day => {
        const date = new Date(day.date);
        return date.getMonth() === monthIndex;
      });

      return {
        name: monthName,
        days: monthDays,
        index: monthIndex
      };
    }).filter(month => month.days.length > 0);
  }, [calendarData]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {months.map((month, monthIndex) => (
          <motion.div
            key={month.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: monthIndex * 0.05 }}
            className="text-center"
          >
            <h4 className="text-sm font-semibold text-gray-400 mb-2 font-mono">
              {month.name}
            </h4>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 31 }, (_, dayIndex) => {
                const day = month.days.find(d => new Date(d.date).getDate() === dayIndex + 1);
                return (
                  <div
                    key={dayIndex}
                    className="w-3 h-3 rounded-sm border border-white/10"
                    style={{
                      backgroundColor: day ? getContributionColor(day.level) : '#0a0a0a'
                    }}
                    title={day ? `${day.date}: ${day.count} 次贡献` : undefined}
                  />
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

