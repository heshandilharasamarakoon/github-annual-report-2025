import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/button';
import { Download, Loader2, Heart, Zap, Sparkles } from 'lucide-react';
import { generateReportImage, downloadBlob } from '../../lib/canvas';
import { generateAICommentStream } from '../../lib/aiCommentStream';
import type { AICommentStyle } from '../../lib/aiComment';
import { useState, useRef } from 'react';

export function FinalSlide() {
  const { slidesData, userData, updateAIComment } = useAppStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<AICommentStyle>('praise');
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingComment, setStreamingComment] = useState('');
  const isStreamingRef = useRef(false);

  if (!slidesData || !userData) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await generateReportImage(userData, slidesData);
      const filename = `github-2025-${userData.login}-${currentStyle}.png`;
      downloadBlob(blob, filename);
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('生成图片失败，请重试');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleStyleChange = async (style: AICommentStyle) => {
    if (style === currentStyle || isStreamingRef.current) return;
    
    setIsGenerating(true);
    setCurrentStyle(style);
    setStreamingComment('');
    isStreamingRef.current = true;
    
    let fullComment = '';

    generateAICommentStream(
      slidesData.persona,
      style,
      slidesData,
      (chunk: string) => {
        fullComment += chunk;
        setStreamingComment(fullComment);
      },
      () => {
        updateAIComment(fullComment);
        setIsGenerating(false);
        isStreamingRef.current = false;
      },
      (error: Error) => {
        console.error('Stream failed:', error);
        setIsGenerating(false);
        isStreamingRef.current = false;
      }
    );
  };

  const styleButtons = [
    { style: 'zako' as AICommentStyle, label: '雌小鬼', icon: Sparkles, color: 'text-pink-300' },
    { style: 'tsundere' as AICommentStyle, label: '傲娇', icon: Zap, color: 'text-yellow-400' },
    { style: 'wholesome' as AICommentStyle, label: '温柔大姐姐', icon: Heart, color: 'text-pink-400' },
    { style: 'praise' as AICommentStyle, label: '夸夸', icon: Sparkles, color: 'text-purple-400' },
  ];

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
            <span className="neon-green neon-glow">2025</span> 完美收官
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex justify-center gap-3 mb-6">
            {styleButtons.map(({ style, label, icon: Icon, color }) => (
              <button
                key={style}
                onClick={() => handleStyleChange(style)}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                  currentStyle === style
                    ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]'
                    : 'bg-[#0a0a0a] border-white/10 text-gray-400 hover:border-white/30'
                } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Icon className={`w-4 h-4 ${currentStyle === style ? 'text-[#10b981]' : color}`} />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 min-h-[240px] flex items-center justify-center">
            {isGenerating && !streamingComment ? (
              <div className="flex items-center gap-3 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>AI 正在深度分析你的数据...</span>
              </div>
            ) : (
              <p className="text-base text-gray-300 leading-relaxed italic max-w-3xl text-left">
                "{isGenerating ? streamingComment : slidesData.aiComment}"
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
          继续保持热情，2026 见！
        </motion.p>
      </div>
    </div>
  );
}

