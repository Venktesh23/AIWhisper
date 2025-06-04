"use client"

export function PremiumSkeleton() {
  return (
    <div className="space-y-6 fade-in">
      {/* Header skeleton */}
      <div className="neuro-card p-6">
        <div className="flex items-center gap-4">
          <div className="skeleton h-12 w-12 rounded-xl" />
          <div className="space-y-2 flex-1">
            <div className="skeleton h-6 w-48 rounded" />
            <div className="skeleton h-4 w-32 rounded" />
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="neuro-card p-6" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="space-y-4">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-32 w-full rounded" />
              <div className="flex gap-2">
                <div className="skeleton h-6 w-16 rounded-full" />
                <div className="skeleton h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorAlert({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="error-alert fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-red-400 mb-1">Error Occurred</h4>
          <p className="text-red-300">{message}</p>
        </div>
        <button 
          onClick={onRetry}
          className="glow-button bg-red-500 hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    </div>
  );
} 