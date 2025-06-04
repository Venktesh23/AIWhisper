"use client"

import { useState, useEffect } from 'react';
import { Clock, FileText, Trash2, Eye, FolderOpen, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSchemas, deleteSchema } from '@/lib/supabase';

interface SchemaHistoryProps {
  onSelectSchema: (schemaId: string, schemaContent: string) => void;
  refreshTrigger?: number;
}

interface SchemaEntry {
  id: string;
  title: string;
  created_at: string;
  schema_content: string;
  summaries?: any[];
}

export default function SchemaHistory({ onSelectSchema, refreshTrigger }: SchemaHistoryProps) {
  const [schemas, setSchemas] = useState<SchemaEntry[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSchemas = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await getSchemas();
      
      if (fetchError) {
        throw fetchError;
      }
      
      setSchemas(data || []);
      setError('');
    } catch (err) {
      console.error('Failed to load schemas:', err);
      setError('Failed to load schemas');
      setSchemas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchemas();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      const { error: deleteError } = await deleteSchema(id);
      
      if (deleteError) {
        throw deleteError;
      }
      
      // Remove from local state
      setSchemas(prev => prev.filter(schema => schema.id !== id));
    } catch (err) {
      console.error('Failed to delete schema:', err);
      setError('Failed to delete schema');
    }
  };

  const handleSelect = (schema: SchemaEntry) => {
    onSelectSchema(schema.id, schema.schema_content);
  };

  const getEndpointCount = (schemaContent: string) => {
    try {
      const parsed = JSON.parse(schemaContent);
      return Object.keys(parsed.paths || {}).length;
    } catch {
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
        <p className="text-sm text-gray-400">Loading your schemas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-400 mb-4">{error}</div>
        <button 
          onClick={loadSchemas}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  if (schemas.length === 0) {
    return (
      <div className="text-center py-16">
        <FolderOpen className="h-16 w-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No schemas uploaded yet</h3>
        <p className="text-sm text-gray-400">Upload your first API schema to get started with documentation generation</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {schemas.map((schema, index) => (
        <motion.div
          key={schema.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative"
          onMouseEnter={() => setHoveredId(schema.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="p-4 rounded-lg bg-black/20 border border-white/5 hover:border-green-500/30 hover:bg-black/40 transition-all duration-200 cursor-pointer backdrop-blur-sm">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-white text-sm truncate pr-2">
                {schema.title}
              </h4>
              
              {/* Action Icons */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleSelect(schema)}
                  className="p-2 hover:bg-green-500/20 rounded-lg text-green-400 hover:scale-110 transition-all"
                  title="View Schema"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(schema.id)}
                  className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:scale-110 transition-all"
                  title="Delete Schema"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{new Date(schema.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-green-500" />
                <span>{getEndpointCount(schema.schema_content)} endpoints</span>
              </div>
            </div>

            {/* Hover indicator */}
            {hoveredId === schema.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-400 rounded-l-lg" />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}