"use client"

import { motion } from 'framer-motion';

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-4">
          <div className="shimmer h-12 w-12 rounded-xl bg-white/10" />
          <div className="space-y-2 flex-1">
            <div className="shimmer h-6 w-48 rounded bg-white/10" />
            <div className="shimmer h-4 w-32 rounded bg-white/10" />
          </div>
        </div>
      </div>

      {/* Content skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="space-y-4">
              <div className="shimmer h-4 w-24 rounded bg-white/10" />
              <div className="shimmer h-32 w-full rounded bg-white/10" />
              <div className="flex gap-2">
                <div className="shimmer h-6 w-16 rounded bg-white/10" />
                <div className="shimmer h-6 w-16 rounded bg-white/10" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ title, description, icon: Icon }: {
  title: string;
  description: string;
  icon: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-xl p-12 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="mx-auto mb-6 p-6 rounded-full bg-emerald-500/20"
      >
        <Icon className="h-12 w-12 text-emerald-400" />
      </motion.div>
      <h3 className="text-xl font-semibold mb-2 heading-font">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <motion.div
        className="inline-block text-sm px-4 py-2 glass-card rounded-lg border-emerald-500/30"
        animate={{ 
          boxShadow: [
            "0 0 0 rgba(74, 222, 128, 0)",
            "0 0 20px rgba(74, 222, 128, 0.3)",
            "0 0 0 rgba(74, 222, 128, 0)"
          ]
        }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        ✨ Drop an OpenAPI spec and watch the magic
      </motion.div>
    </motion.div>
  );
} 