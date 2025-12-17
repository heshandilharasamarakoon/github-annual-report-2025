import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

export function RadarSlide() {
  const { slidesData } = useAppStore();

  if (!slidesData) return null;

  const personaLabels: Record<string, string> = {
    'night-owl': '夜猫子程序员',
    'early-bird': '早起鸟工程师',
    'weekend-warrior': '周末战士',
    'consistent-contributor': '稳定贡献者',
    default: '代码创造者',
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pb-20">
      <div className="max-w-4xl w-full mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8"
        >
          你的 <span className="neon-green neon-glow">开发者画像</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-[#10b981]/10 border border-[#10b981]/30 rounded-2xl px-8 py-4">
            <span className="text-[#10b981] text-xl font-bold neon-glow">
              {personaLabels[slidesData.persona] || personaLabels.default}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-w-3xl mx-auto"
        >
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={slidesData.radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#9ca3af', fontSize: 14 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Radar
                name="能力值"
                dataKey="value"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

