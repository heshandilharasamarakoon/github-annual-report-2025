import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useState, useEffect } from 'react';
import { getQuarter, getQuarterName } from '../../lib/timeUtils';

export function ActivityTrendSlide() {
  const { slidesData } = useAppStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!slidesData || !slidesData.commitActivity) return null;

  const chartData = slidesData.commitActivity.map(item => {
    const quarter = getQuarter(item.month);
    return {
      month: item.month.substring(5),
      commits: item.count,
      quarter: getQuarterName(quarter),
    };
  });

  const quarterMarkers = [
    { month: '03', quarter: 'Q1' },
    { month: '06', quarter: 'Q2' },
    { month: '09', quarter: 'Q3' },
    { month: '12', quarter: 'Q4' },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pb-20">
      <div className="max-w-5xl w-full mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12"
        >
          你的 <span className="neon-green neon-glow">2025</span> 月度趋势
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 md:p-8"
        >
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 350}>
            <AreaChart data={chartData} margin={isMobile ? { top: 10, right: 10, left: 10, bottom: 0 } : { top: 10, right: 30, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                style={{ fontSize: isMobile ? '12px' : '14px' }}
                tick={{ fontSize: isMobile ? 12 : 14 }}
              />
              {!isMobile && (
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: '14px' }}
                  tick={{ fontSize: 14 }}
                />
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 10, 0.95)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: isMobile ? '12px' : '14px',
                }}
                labelStyle={{ color: '#10b981' }}
              />
              <Area
                type="monotone"
                dataKey="commits"
                stroke="#10b981"
                strokeWidth={isMobile ? 2 : 3}
                fillOpacity={1}
                fill="url(#colorCommits)"
              />
              {quarterMarkers.map((marker, idx) => {
                const dataIndex = chartData.findIndex(d => d.month.startsWith(marker.month));
                if (dataIndex >= 0) {
                  return (
                    <ReferenceLine
                      key={idx}
                      x={chartData[dataIndex].month}
                      stroke="rgba(16, 185, 129, 0.3)"
                      strokeDasharray="2 2"
                      label={{ value: marker.quarter, position: 'top', fill: '#6b7280', fontSize: 10 }}
                    />
                  );
                }
                return null;
              })}
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center"
        >
          <div>
            <p className="text-gray-500 text-xs md:text-sm mb-1">总提交</p>
            <p className="text-[#10b981] text-xl md:text-2xl font-bold font-mono">{slidesData.totalCommits}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs md:text-sm mb-1">PR</p>
            <p className="text-[#10b981] text-xl md:text-2xl font-bold font-mono">{slidesData.totalPRs}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs md:text-sm mb-1">Review</p>
            <p className="text-[#10b981] text-xl md:text-2xl font-bold font-mono">{slidesData.totalReviews}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs md:text-sm mb-1">Issue</p>
            <p className="text-[#10b981] text-xl md:text-2xl font-bold font-mono">{slidesData.totalIssues}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

