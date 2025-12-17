import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface IntroViewProps {
  onComplete: () => void;
}

export function IntroView({ onComplete }: IntroViewProps) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = '> 正在分析你的 GitHub 2025...\n> 加载提交记录...\n> 计算代码统计...\n> 生成年度报告...\n> 完成!';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
        setShowCursor(false);
        setTimeout(onComplete, 800);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen bg-black"
    >
      <div className="max-w-2xl w-full p-8">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6 font-mono">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <pre className="text-[#10b981] text-sm leading-relaxed whitespace-pre-wrap">
            {displayText}
            {showCursor && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-[#10b981] ml-1"
              />
            )}
          </pre>
        </div>
      </div>
    </motion.div>
  );
}

