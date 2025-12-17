import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { ExternalLink, Star, GitFork, GitCommit, FileText, Sparkles, RefreshCw } from 'lucide-react';
import { analyzeCommitMessages } from '../../lib/commitAnalyzer';
import { generateAIAnalysisStream } from '../../lib/aiAnalysisStream';
import { useMemo, useEffect, useState, useCallback } from 'react';

export function RepositoriesSlide() {
  const { slidesData, aiStyle, aiAnalysis, setAIAnalysis } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const allCommits = useMemo(() => {
    if (!slidesData || !slidesData.topRepositories) return [];
    return slidesData.topRepositories.flatMap(repo => repo.recentCommits);
  }, [slidesData]);

  const commitAnalysis = useMemo(() => {
    return analyzeCommitMessages(allCommits);
  }, [allCommits]);

  const generateAnalysis = useCallback(async () => {
    if (!slidesData?.topRepositories || isGenerating) return;
    if (allCommits.length === 0 || slidesData.topRepositories.length === 0) return;

    setIsGenerating(true);
    setAIAnalysis(null);

    let accumulatedContent = '';

    try {
      await generateAIAnalysisStream(
        allCommits,
        slidesData.topRepositories,
        aiStyle || 'praise',
        (chunk) => {
          accumulatedContent += chunk;
          setAIAnalysis(accumulatedContent);
        },
        () => {
          setIsGenerating(false);
        },
        () => {
          setIsGenerating(false);
        }
      );
    } catch {
      setIsGenerating(false);
    }
  }, [slidesData, allCommits, aiStyle, isGenerating, setAIAnalysis]);

  useEffect(() => {
    if (aiAnalysis === null && !isGenerating && slidesData?.topRepositories && allCommits.length > 0) {
      generateAnalysis();
    }
  }, [aiAnalysis, isGenerating, slidesData, allCommits, generateAnalysis]);

  if (!slidesData || !slidesData.topRepositories) return null;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pb-20">
      <div className="max-w-4xl w-full mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8"
        >
          你的 <span className="neon-green neon-glow">2025</span> 热门项目
        </motion.h2>

        {commitAnalysis.totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 space-y-6"
          >
            <div className="bg-gradient-to-br from-[#10b981]/10 to-[#34d399]/5 border border-[#10b981]/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#10b981]/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#10b981]" />
                </div>
                <h3 className="text-xl font-bold text-white">Commit 风格分析</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0a0a0a]/50 rounded-lg p-4 border border-white/5">
                  <div className="text-xs text-gray-500 mb-1">风格类型</div>
                  <div className="text-lg font-bold text-[#10b981]">{commitAnalysis.style}</div>
                  <div className="text-xs text-gray-400 mt-1">{commitAnalysis.description}</div>
                </div>
                <div className="bg-[#0a0a0a]/50 rounded-lg p-4 border border-white/5">
                  <div className="text-xs text-gray-500 mb-1">平均长度</div>
                  <div className="text-lg font-bold text-[#10b981]">{commitAnalysis.avgLength}</div>
                  <div className="text-xs text-gray-400 mt-1">字符</div>
                </div>
                <div className="bg-[#0a0a0a]/50 rounded-lg p-4 border border-white/5">
                  <div className="text-xs text-gray-500 mb-1">表情符号</div>
                  <div className="text-lg font-bold text-[#10b981]">
                    {commitAnalysis.hasEmoji ? '是' : '否'}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {commitAnalysis.hasEmoji ? '喜欢使用' : '未使用'}
                  </div>
                </div>
                <div className="bg-[#0a0a0a]/50 rounded-lg p-4 border border-white/5">
                  <div className="text-xs text-gray-500 mb-1">分析样本</div>
                  <div className="text-lg font-bold text-[#10b981]">{commitAnalysis.totalCount}</div>
                  <div className="text-xs text-gray-400 mt-1">条提交</div>
                </div>
              </div>
            </div>

            {(aiAnalysis || isGenerating) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#10b981]/10 to-[#34d399]/5 border border-[#10b981]/20 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#10b981]/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#10b981]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">AI 深度分析</h3>
                    {isGenerating && (
                      <div className="flex items-center gap-2 text-[#10b981] text-sm">
                        <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                        <span>生成中...</span>
                      </div>
                    )}
                  </div>
                  {!isGenerating && aiAnalysis && (
                    <button
                      onClick={generateAnalysis}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#10b981] hover:text-[#34d399] border border-[#10b981]/30 hover:border-[#10b981]/50 rounded-lg transition-all hover:bg-[#10b981]/10"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>重新生成</span>
                    </button>
                  )}
                </div>
                {aiAnalysis ? (
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {aiAnalysis}
                    {isGenerating && (
                      <span className="inline-block w-2 h-4 bg-[#10b981] ml-1 animate-pulse" />
                    )}
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm">正在分析你的代码和提交记录...</p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        <div className="space-y-4">
          {slidesData.topRepositories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-500"
            >
              <p>2025年还没有项目贡献记录</p>
            </motion.div>
          ) : (
            slidesData.topRepositories.map((repo, idx) => (
              <motion.a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="block bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-[#10b981]/40 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#10b981] transition-colors">
                        {repo.name}
                      </h3>
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-[#10b981] transition-colors opacity-0 group-hover:opacity-100" />
                    </div>
                    {repo.description && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                    {repo.recentCommits.length > 0 && (
                      <div className="space-y-1.5 mt-3 max-h-48 overflow-y-auto custom-scrollbar">
                        {repo.recentCommits.map((commit, commitIdx) => (
                          <div key={commitIdx} className="flex items-start gap-2 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] mt-1.5 shrink-0" />
                            <span className="text-gray-500 line-clamp-1 flex-1">
                              {commit.message}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
                  <div className="flex items-center gap-4 text-sm">
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

                  <div className="flex items-center gap-2 px-4 py-2 bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg group-hover:bg-[#10b981]/20 group-hover:border-[#10b981]/40 transition-all">
                    <GitCommit className="w-4 h-4 text-[#10b981]" />
                    <span className="text-[#10b981] font-bold text-sm">
                      {repo.commits2025}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">次提交</span>
                  </div>
                </div>
              </motion.a>
            ))
          )}
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

