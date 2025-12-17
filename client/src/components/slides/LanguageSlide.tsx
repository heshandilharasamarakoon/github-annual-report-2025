import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { Progress } from '../ui/progress';

export function LanguageSlide() {
  const { slidesData } = useAppStore();

  if (!slidesData) return null;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pb-20">
      <div className="max-w-2xl w-full mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12"
        >
          你的 <span className="neon-green neon-glow">编程语言</span> 分布
        </motion.h2>

        <div className="space-y-6">
          {slidesData.topLanguages.map((lang, idx) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="font-semibold text-lg">{lang.name}</span>
                </div>
                <span className="text-[#10b981] font-bold text-xl">
                  {lang.percentage.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={lang.percentage}
                className="h-3 bg-white/5 rounded-full"
                style={{
                  '--progress-color': lang.color,
                } as React.CSSProperties}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

