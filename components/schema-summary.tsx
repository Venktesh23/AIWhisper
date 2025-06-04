"use client"

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Copy, Download, RefreshCw, CheckCircle2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SchemaSummaryProps {
  summary: string;
  isLoading: boolean;
  onRegenerate?: () => void;
}

export default function SchemaSummary({ summary, isLoading, onRegenerate }: SchemaSummaryProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'api-documentation.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-black/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
              <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  if (!summary) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 bg-black/20 backdrop-blur-sm border border-gray-700/30 rounded-xl"
      >
        <div className="text-gray-400 text-lg font-medium mb-2">No documentation generated yet</div>
        <div className="text-gray-500 text-sm">Upload an API schema to get started</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Action Bar */}
      <div className="flex items-center justify-between bg-black/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-4">
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-100">
          API Documentation
        </h3>
        <div className="flex items-center gap-3">
          {onRegenerate && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRegenerate}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-200 bg-gray-800/50 hover:bg-gray-700/50 px-3 py-2 rounded-lg transition-all text-sm font-medium"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-200 bg-gray-800/50 hover:bg-gray-700/50 px-3 py-2 rounded-lg transition-all text-sm font-medium"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="copied"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2 text-green-400"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Copied!
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-200 bg-gray-800/50 hover:bg-gray-700/50 px-3 py-2 rounded-lg transition-all text-sm font-medium"
          >
            <Download className="h-4 w-4" />
            Download
          </motion.button>
        </div>
      </div>

      {/* Enhanced Summary Display */}
      <motion.div
        whileHover={{ scale: 1.005 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-black/30 backdrop-blur-sm border border-gray-700/30 rounded-xl overflow-hidden shadow-2xl hover:shadow-gray-900/50 hover:border-gray-600/40 transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, 
            rgba(31, 31, 31, 0.4) 0%, 
            rgba(20, 20, 20, 0.6) 50%, 
            rgba(15, 15, 15, 0.4) 100())`,
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            inset 0 1px 0 rgba(255, 255, 255, 0.05)
          `
        }}
      >
        <div className="p-8">
          <ReactMarkdown
            className="prose prose-invert prose-gray max-w-none"
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-100 mb-6 leading-tight">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-gray-200 mb-4 mt-8 leading-tight">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-gray-300 mb-3 mt-6">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-300 leading-relaxed mb-4 font-normal">
                  {children}
                </p>
              ),
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="my-6 rounded-xl overflow-hidden border border-gray-700/50">
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        borderRadius: 0,
                        background: 'rgba(15, 15, 15, 0.8)',
                        fontSize: '14px'
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="bg-gray-800/60 text-gray-300 px-2 py-1 rounded font-mono text-sm border border-gray-700/30" {...props}>
                    {children}
                  </code>
                );
              },
              ul: ({ children }) => (
                <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-4">
                  {children}
                </ol>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-400 my-4 bg-gray-800/20 py-2 rounded-r-lg">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-6">
                  <table className="w-full border-collapse bg-gray-900/30 rounded-xl overflow-hidden">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-gray-700 px-4 py-3 text-left font-semibold text-gray-200 bg-gray-800/50">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-700 px-4 py-3 text-gray-300">
                  {children}
                </td>
              ),
            }}
          >
            {summary}
          </ReactMarkdown>
        </div>
      </motion.div>
    </motion.div>
  );
}