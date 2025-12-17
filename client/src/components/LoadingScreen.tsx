import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  const messages = useMemo(() => [
    '正在连接 GitHub...',
    '正在获取用户信息',
    '正在分析 2025 年数据',
    '正在计算统计数据',
    '正在生成报告'
  ], []);

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (message) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 800);

    return () => clearInterval(interval);
  }, [message, messages.length]);

  const displayMessage = message || messages[messageIndex];

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Loader2 className="w-16 h-16 text-[#10b981] animate-spin mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white font-mono">{displayMessage}</span>
          </div>

          <motion.div
            className="flex justify-center gap-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-[#10b981] rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

