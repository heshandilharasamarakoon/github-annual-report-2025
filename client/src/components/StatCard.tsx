import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { type ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
  delay?: number;
}

export function StatCard({ title, value, icon, subtitle, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="bg-[#0a0a0a] border-white/10 p-6 hover:border-[#10b981]/30 transition-colors rounded-2xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-gray-400 text-sm mb-2">{title}</p>
            <p className="text-[#10b981] text-4xl font-bold neon-glow">{value}</p>
            {subtitle && <p className="text-gray-500 text-xs mt-2">{subtitle}</p>}
          </div>
          {icon && <div className="text-gray-600">{icon}</div>}
        </div>
      </Card>
    </motion.div>
  );
}

