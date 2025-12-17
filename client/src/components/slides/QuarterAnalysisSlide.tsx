import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GitCommit } from 'lucide-react';

export function QuarterAnalysisSlide() {
  const { slidesData } = useAppStore();

  if (!slidesData || !slidesData.quarterStats) return null;

  const chartData = slidesData.quarterStats.map(q => ({
    name: q.name,
    commits: q.commits,
  }));

  const colors = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pb-20">
      <div className="max-w-5xl w-full mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12"
        >
          你的 <span className="neon-green neon-glow">2025</span> 季度分析
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 md:p-8 mb-8"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 10, 0.95)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
                labelStyle={{ color: '#10b981' }}
              />
              <Bar dataKey="commits" fill="#10b981" radius={[8, 8, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {slidesData.quarterStats.map((quarter, idx) => (
            <motion.div
              key={quarter.quarter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6"
            >
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-[#10b981] mb-2">{quarter.name}</div>
                <div className="text-xs text-gray-500">2025</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 text-gray-400">
                  <GitCommit className="w-5 h-5" />
                  <span className="text-sm">提交</span>
                </div>
                <span className="text-[#10b981] font-bold text-2xl ml-4">{quarter.commits}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

