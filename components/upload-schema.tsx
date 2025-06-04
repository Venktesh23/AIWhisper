"use client"

import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { saveSchema } from '@/lib/supabase';

interface UploadSchemaProps {
  onUploadComplete: (schemaId: string, schemaContent: string) => void;
  onSchemaAdded?: () => void;
}

export default function UploadSchema({ onUploadComplete, onSchemaAdded }: UploadSchemaProps) {
  const [dragActive, setDragActive] = useState(false);
  const [schemaContent, setSchemaContent] = useState('');
  const [schemaName, setSchemaName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  }, []);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError('');
    
    try {
      const content = await file.text();
      const parsed = JSON.parse(content);
      
      if (!parsed.openapi && !parsed.swagger) {
        throw new Error('Not a valid OpenAPI/Swagger schema');
      }

      setSchemaContent(content);
      setSchemaName(file.name.replace(/\.(json|yaml|yml)$/i, ''));
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleTextareaChange = (content: string) => {
    setSchemaContent(content);
    setError('');
    
    if (content.trim()) {
      try {
        const parsed = JSON.parse(content);
        if (parsed.openapi || parsed.swagger) {
          setSuccess(true);
          setSchemaName(parsed.info?.title || 'Untitled API');
        } else {
          setSuccess(false);
        }
      } catch {
        setSuccess(false);
      }
    } else {
      setSuccess(false);
    }
  };

  const handleSubmit = async () => {
    if (!schemaContent.trim()) {
      setError('Please provide a schema');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const parsed = JSON.parse(schemaContent);
      if (!parsed.openapi && !parsed.swagger) {
        setError('Not a valid OpenAPI/Swagger schema');
        return;
      }

      const title = schemaName || parsed.info?.title || 'Untitled API';
      
      // Save to Supabase database
      const { data, error: saveError } = await saveSchema(title, schemaContent);
      
      if (saveError) {
        throw saveError;
      }

      if (data) {
        // Clear form
        setSchemaContent('');
        setSchemaName('');
        setSuccess(false);
        
        // Notify parent components
        onUploadComplete(data.id, schemaContent);
        onSchemaAdded?.(); // Refresh schema history
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save schema');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Schema Name Input */}
      <div>
        <label className="block text-sm font-semibold text-white mb-3">
          Schema Name
        </label>
        <input
          type="text"
          value={schemaName}
          onChange={(e) => setSchemaName(e.target.value)}
          placeholder="My API v1.0"
          className="w-full glass-input rounded-lg px-4 py-3 text-white placeholder-gray-400 text-sm"
        />
      </div>

      {/* Upload Zone */}
      <div
        className={`premium-upload-zone ${dragActive ? 'drag-active' : ''} p-8 rounded-xl text-center cursor-pointer relative overflow-hidden`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleFileSelect}
          accept=".json,.yaml,.yml"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        <div className="space-y-4 relative z-0">
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-green-400 animate-spin" />
              <p className="text-gray-300 mt-3 font-medium">Processing file...</p>
            </div>
          ) : success && schemaContent ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-green-400" />
              <p className="text-green-400 font-semibold mt-3">Schema loaded successfully!</p>
              <p className="text-gray-400 text-sm">Ready to generate documentation</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400" />
              <p className="text-white font-semibold mt-3">Drag & drop your schema file</p>
              <p className="text-gray-400 text-sm">Supports JSON, YAML, and YML formats</p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Input */}
      <div>
        <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          Or paste your schema directly
        </label>
        <textarea
          value={schemaContent}
          onChange={(e) => handleTextareaChange(e.target.value)}
          placeholder="Paste your OpenAPI/Swagger JSON here..."
          className="w-full h-40 code-editor rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 text-xs resize-none"
        />
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
        >
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{error}</span>
        </motion.div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!schemaContent.trim() || isProcessing}
        className="w-full premium-button disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 text-sm"
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileText className="h-4 w-4" />
        )}
        {isProcessing ? 'Saving...' : 'Generate Documentation'}
      </button>
    </div>
  );
}