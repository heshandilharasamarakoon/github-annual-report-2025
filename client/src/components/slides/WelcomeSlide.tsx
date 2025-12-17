import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getCurrentYearProgress, getProgressText } from '../../lib/timeUtils';

export function WelcomeSlide() {
  const { userData } = useAppStore();

  if (!userData) return null;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pb-20">
      <div className="text-center max-w-2xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="mb-8"
        >
          <Avatar className="w-32 h-32 mx-auto border-4 border-[#10b981]">
            <AvatarImage src={userData.avatarUrl} alt={userData.name} />
            <AvatarFallback>{userData.name?.[0]}</AvatarFallback>
          </Avatar>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold mb-4"
        >
          你好，<span className="neon-green neon-glow">{userData.name || userData.login}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 text-xl mb-6"
        >
          这是你的 GitHub 2025 年度总结
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">2025年进度</span>
              <span className="text-sm font-bold text-[#10b981]">{getCurrentYearProgress().toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getCurrentYearProgress()}%` }}
                transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399]"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">{getProgressText()}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-gray-500 text-sm"
        >
          使用方向键或点击导航按钮浏览
        </motion.div>
      </div>
    </div>
  );
}

