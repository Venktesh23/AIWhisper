"use client"

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const methodConfig = {
  GET: { color: '#10B981', icon: '🟢', bg: 'bg-green-500/20' },
  POST: { color: '#3B82F6', icon: '🔵', bg: 'bg-blue-500/20' },
  PUT: { color: '#F59E0B', icon: '🟡', bg: 'bg-yellow-500/20' },
  DELETE: { color: '#EF4444', icon: '🔴', bg: 'bg-red-500/20' },
  PATCH: { color: '#8B5CF6', icon: '🟣', bg: 'bg-purple-500/20' }
};

export function MethodBadge({ method }: { method: string }) {
  const config = methodConfig[method as keyof typeof methodConfig] || methodConfig.GET;
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Badge className={`mono-font glass-card border-white/20 ${config.bg} hover:border-white/40 transition-all`}>
        <span className="mr-2 text-sm">{config.icon}</span>
        <span style={{ color: config.color }} className="font-bold">
          {method}
        </span>
      </Badge>
    </motion.div>
  );
} 