import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/button';
import { Download, Loader2, RefreshCw } from 'lucide-react';
import { generateReportImage, downloadBlob } from '../../lib/canvas';
import { generateAICommentStream } from '../../lib/aiCommentStream';
import { useState, useEffect } from 'react';
import { is2025Complete, getProgressText } from '../../lib/timeUtils';

export function FinalSlide() {
  const { slidesData, userData, updateAIComment, aiStyle, aiComment, setAIComment } = useAppStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingComment, setStreamingComment] = useState('');

  if (!slidesData || !userData || !aiStyle) return null;

  const generateComment = async () => {
    if (!slidesData || isGenerating) return;

    console.log('开始生成 AI 评论...');
    setIsGenerating(true);
    setAIComment(null);
    setStreamingComment('');

    let fullComment = '';

    try {
      await generateAICommentStream(
        slidesData.persona,
        aiStyle,
        slidesData,
        (chunk: string) => {
          fullComment += chunk;
          setStreamingComment(fullComment);
        },
        () => {
          updateAIComment(fullComment);
          setAIComment(fullComment);
          setIsGenerating(false);
        },
        (error: Error) => {
          console.error('Stream failed:', error);
          setIsGenerating(false);
        }
      );
    } catch (error) {
      console.error('生成 AI 评论时出错:', error);
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (aiComment === null && !isGenerating && slidesData && aiStyle) {
      generateComment();
    } else if (aiComment) {
      setStreamingComment(aiComment);
    }
  }, [slidesData, aiStyle, aiComment, isGenerating]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await generateReportImage(userData, slidesData);
      const filename = `github-2025-${userData.login}-${aiStyle}.png`;
      downloadBlob(blob, filename);
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('生成图片失败，请重试');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pb-20">
      <div className="max-w-3xl w-full mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="mb-12"
        >
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-5xl font-bold mb-4">
            {is2025Complete() ? (
              <>
                <span className="neon-green neon-glow">2025</span> 完美收官
              </>
            ) : (
              <>
                <span className="neon-green neon-glow">2025</span> 进行中
              </>
            )}
          </h2>
          {!is2025Complete() && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 text-lg mb-4"
            >
              {getProgressText()}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 min-h-[240px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">AI 年度总结</h3>
              {!isGenerating && aiComment && (
                <button
                  onClick={generateComment}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#10b981] hover:text-[#34d399] border border-[#10b981]/30 hover:border-[#10b981]/50 rounded-lg transition-all hover:bg-[#10b981]/10"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>重新生成</span>
                </button>
              )}
            </div>
            <div className="flex-1 flex items-center justify-center">
              {isGenerating && !streamingComment ? (
                <div className="flex flex-col items-center gap-3 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin text-[#10b981]" />
                  <span>AI 正在深度分析你的代码和提交记录...</span>
                  <span className="text-xs text-gray-500">这可能需要几秒钟</span>
                </div>
              ) : (
                <p className="text-base text-gray-300 leading-relaxed italic max-w-3xl text-left w-full">
                  "{isGenerating ? streamingComment : (aiComment || streamingComment)}"
                  {isGenerating && (
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block ml-1 text-[#10b981]"
                    >
                      ▊
                    </motion.span>
                  )}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 justify-center"
        >
          <Button
            onClick={handleDownload}
            disabled={isDownloading || isGenerating}
            variant="outline"
            className="border-white/20 hover:border-[#10b981]/50"
            size="lg"
          >
            {isDownloading || isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                下载报告
              </>
            )}
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-gray-500 mt-12"
        >
          {is2025Complete() ? '继续保持热情，2026 见！' : '继续加油，完成你的2025年目标！'}
        </motion.p>
      </div>
    </div>
  );
}

