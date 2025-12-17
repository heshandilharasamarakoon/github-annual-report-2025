import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { StatCard } from '../StatCard';
import { GitCommit, GitPullRequest, Star, FolderGit } from 'lucide-react';

export function StatsOverviewSlide() {
  const { slidesData } = useAppStore();

  if (!slidesData) return null;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pb-20">
      <div className="max-w-4xl w-full mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12"
        >
          你的 <span className="neon-green neon-glow">2025</span> 代码足迹
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <StatCard
            title="总提交次数"
            value={slidesData.totalCommits.toLocaleString()}
            icon={<GitCommit className="w-8 h-8" />}
            delay={0.2}
          />
          <StatCard
            title="PR 数量"
            value={slidesData.totalPRs.toLocaleString()}
            icon={<GitPullRequest className="w-8 h-8" />}
            delay={0.3}
          />
          <StatCard
            title="获得星标"
            value={slidesData.totalStars.toLocaleString()}
            icon={<Star className="w-8 h-8" />}
            delay={0.4}
          />
          <StatCard
            title="仓库数量"
            value={slidesData.totalRepos.toLocaleString()}
            icon={<FolderGit className="w-8 h-8" />}
            delay={0.5}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center text-gray-400"
        >
          你最忙碌的一天是 <span className="text-[#10b981] font-bold">{slidesData.busiestDay.date}</span>
          ，完成了 <span className="text-[#10b981] font-bold">{slidesData.busiestDay.count}</span> 次提交
        </motion.div>
      </div>
    </div>
  );
}

