import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { ExternalLink, Star, GitFork } from 'lucide-react';

export function RepositoriesSlide() {
  const { slidesData } = useAppStore();

  if (!slidesData || !slidesData.topRepositories) return null;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pb-20">
      <div className="max-w-4xl w-full mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12"
        >
          你的 <span className="neon-green neon-glow">热门项目</span>
        </motion.h2>

        <div className="space-y-4">
          {slidesData.topRepositories.slice(0, 5).map((repo, idx) => (
            <motion.a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="block bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-[#10b981]/40 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#10b981] transition-colors">
                      {repo.name}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-[#10b981] transition-colors" />
                  </div>
                  {repo.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: '#10b981' }}
                  />
                  <span className="text-gray-400">{repo.language}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Star className="w-4 h-4" />
                  <span className="text-[#10b981] font-semibold">{repo.stargazerCount}</span>
                </div>
                {repo.forkCount > 0 && (
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <GitFork className="w-4 h-4" />
                    <span>{repo.forkCount}</span>
                  </div>
                )}
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center text-gray-400 text-sm"
        >
          共计 <span className="text-[#10b981] font-bold">{slidesData.totalStars}</span> 个星标
          {' • '}
          <span className="text-[#10b981] font-bold">{slidesData.totalForks}</span> 次 Fork
        </motion.div>
      </div>
    </div>
  );
}

