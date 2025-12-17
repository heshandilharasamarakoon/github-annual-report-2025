import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { Sparkles, Zap, Heart } from 'lucide-react';
import type { AICommentStyle } from '../../store/useAppStore';

export function StyleSelectionSlide() {
  const { setAIStyle, userData } = useAppStore();

  const styleOptions: Array<{
    style: AICommentStyle;
    label: string;
    description: string;
    icon: typeof Sparkles;
    color: string;
    bgGradient: string;
  }> = [
    {
      style: 'zako',
      label: '雌小鬼',
      description: '调皮可爱，带点小傲娇',
      icon: Sparkles,
      color: 'text-pink-300',
      bgGradient: 'from-pink-500/20 to-purple-500/20',
    },
    {
      style: 'tsundere',
      label: '傲娇',
      description: '表面冷淡，内心温暖',
      icon: Zap,
      color: 'text-yellow-400',
      bgGradient: 'from-yellow-500/20 to-orange-500/20',
    },
    {
      style: 'wholesome',
      label: '温柔大姐姐',
      description: '温柔体贴，充满鼓励',
      icon: Heart,
      color: 'text-pink-400',
      bgGradient: 'from-pink-500/20 to-rose-500/20',
    },
    {
      style: 'praise',
      label: '夸夸',
      description: '热情赞美，正能量满满',
      icon: Sparkles,
      color: 'text-purple-400',
      bgGradient: 'from-purple-500/20 to-indigo-500/20',
    },
  ];

  const handleSelect = (style: AICommentStyle) => {
    setAIStyle(style);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 pb-20">
      <div className="max-w-2xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            选择你的 <span className="neon-green neon-glow">AI 评论风格</span>
          </h2>
          <p className="text-gray-400 text-lg">
            选择一种风格，让 AI 为你生成专属的 2025 年度总结
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3">
          {styleOptions.map((option, idx) => {
            const Icon = option.icon;
            return (
              <motion.button
                key={option.style}
                onClick={() => handleSelect(option.style)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 bg-[#0a0a0a] hover:border-[#10b981]/50 hover:bg-[#10b981]/10 transition-all group`}
              >
                <Icon className={`w-4 h-4 ${option.color}`} />
                <span className="text-white text-sm font-medium">{option.label}</span>
              </motion.button>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          选择后将跳转到 GitHub 登录
        </motion.p>
      </div>
    </div>
  );
}

