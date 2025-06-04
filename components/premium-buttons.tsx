"use client"

import { Copy, RefreshCw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  loading?: boolean;
}

export function PremiumButton({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick, 
  className,
  loading 
}: PremiumButtonProps) {
  const variants = {
    primary: 'glow-button',
    secondary: 'glass-card-hover px-4 py-2 text-white/70 hover:text-white',
    danger: 'glow-button bg-red-500 hover:bg-red-600'
  };

  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className={cn(variants[variant], className, loading && 'opacity-50 cursor-not-allowed')}
    >
      {loading ? (
        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
}

export function CopyButton({ text }: { text: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <PremiumButton variant="secondary" size="sm" onClick={handleCopy}>
      <Copy className="h-4 w-4 mr-2" />
      Copy
    </PremiumButton>
  );
}

export function DownloadButton({ data, filename }: { data: string; filename: string }) {
  const handleDownload = () => {
    const blob = new Blob([data], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PremiumButton onClick={handleDownload}>
      <Download className="h-4 w-4 mr-2" />
      Download Summary
    </PremiumButton>
  );
} 