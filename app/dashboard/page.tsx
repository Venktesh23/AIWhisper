"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UploadSchema from '@/components/upload-schema';
import SchemaHistory from '@/components/schema-history';
import SchemaSummary from '@/components/schema-summary';
import ApiMetrics from '@/components/api-metrics';
import ChatWidget from '@/components/chat-widget';
import { Bot, BarChart2, FileText, Sparkles, ArrowLeft, User, HelpCircle, LogOut, Loader2, ChevronDown, BookOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseOpenApiSchema } from '@/lib/openai';
import { useSupabase } from '@/components/supabase-provider'
import { supabase } from '@/lib/supabase-client'

export default function DashboardPage() {
  const [activeSchemaId, setActiveSchemaId] = useState<string>('');
  const [activeSchemaContent, setActiveSchemaContent] = useState<string>('');
  const [viewMode, setViewMode] = useState<'upload' | 'summary'>('upload');
  const [activeTab, setActiveTab] = useState<'documentation' | 'metrics'>('documentation');
  const { user, loading: authLoading } = useSupabase()
  const [showDropdown, setShowDropdown] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);
  
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth')
    }
  }, [user, authLoading, router])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  const handleUploadComplete = (schemaId: string, schemaContent: string) => {
    setActiveSchemaId(schemaId);
    setActiveSchemaContent(schemaContent);
    setViewMode('summary');
  };

  const handleSchemaAdded = () => {
    setRefreshHistory(prev => prev + 1);
  };

  const handleSelectSchema = (schemaId: string, schemaContent: string) => {
    setActiveSchemaId(schemaId);
    setActiveSchemaContent(schemaContent);
    setViewMode('summary');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen premium-gradient-bg flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const endpoints = activeSchemaContent ? parseOpenApiSchema(JSON.parse(activeSchemaContent)) : [];

  return (
    <div className="min-h-screen overflow-y-auto premium-gradient-bg text-white font-['Plus_Jakarta_Sans',_'Inter',_sans-serif]">
      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6 w-full">
          {/* Left Corner - Enhanced Non-Clickable Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="h-10 w-10 text-gray-400" />
              <div className="absolute inset-0 bg-gray-400/10 blur-lg rounded-full"></div>
            </div>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-200 tracking-tight">
              API WHISPER
            </span>
          </div>

          {/* Right Corner - Navigation + Profile */}
          <div className="flex items-center gap-3">
            {/* Instructions/Help Button */}
            <Link href="/instructions">
              <button className="h-10 w-10 rounded-full border border-gray-500/50 bg-gray-800/30 backdrop-blur-sm flex items-center justify-center hover:border-gray-400/70 hover:bg-gray-700/40 hover:shadow-lg hover:shadow-gray-600/20 transition-all duration-200 group">
                <BookOpen className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
              </button>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="h-10 w-10 rounded-full border border-gray-500/50 bg-gray-800/30 backdrop-blur-sm flex items-center justify-center hover:border-gray-400/70 hover:bg-gray-700/40 hover:shadow-lg hover:shadow-gray-600/20 transition-all duration-200 group"
                title="Profile Menu"
              >
                <User className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 top-12 w-72 bg-black/90 backdrop-blur-xl border border-gray-600/30 rounded-xl shadow-2xl py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-4 border-b border-gray-600/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-800/50 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {user?.email || 'User'}
                        </p>
                        <p className="text-xs text-gray-400">
                          API Whisper Account
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="py-2">
                    {/* Logout Option */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        handleSignOut();
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-gray-800/50 hover:text-red-300 transition-colors flex items-center gap-3"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {viewMode === 'upload' ? (
        <div className="flex-1 px-6 py-8">
          {/* Gray Gradient Headline */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-400 via-gray-300 to-gray-100 text-transparent bg-clip-text leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)]">
              Upload an API schema and get instant
              <br />
              human-friendly documentation
            </h1>
          </div>

          {/* Premium Two-Column Layout */}
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 h-[75vh]">
              {/* Left Box - Schema History (35% width) */}
              <div className="w-full lg:w-[35%] h-full premium-box-gradient rounded-xl p-6 overflow-hidden flex flex-col">
                <div className="mb-6 flex-shrink-0">
                  <h2 className="text-xl font-bold text-white mb-2">Schema History</h2>
                  <p className="text-sm text-gray-400">Previously uploaded API schemas</p>
                </div>
                <div className="flex-1 overflow-y-auto premium-scrollbar">
                  <SchemaHistory 
                    onSelectSchema={handleSelectSchema} 
                    refreshTrigger={refreshHistory} 
                  />
                </div>
              </div>

              {/* Right Box - Upload Schema (65% width) */}
              <div className="w-full lg:w-[65%] h-full premium-box-gradient rounded-xl p-6 overflow-hidden flex flex-col">
                <div className="mb-6 flex-shrink-0">
                  <h2 className="text-xl font-bold text-white mb-2">Upload API Schema</h2>
                  <p className="text-sm text-gray-400">Upload your OpenAPI/Swagger specification to get started</p>
                  
                  {endpoints.length > 0 && (
                    <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                      <Sparkles className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300 font-medium text-sm">
                        {endpoints.length} endpoints ready for analysis
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto premium-scrollbar">
                  <UploadSchema 
                    onUploadComplete={handleUploadComplete} 
                    onSchemaAdded={handleSchemaAdded}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Summary View */
        <div className="flex-1 px-6 py-10">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => setViewMode('upload')}
              className="flex items-center gap-2 text-gray-300 hover:bg-gradient-to-r hover:from-gray-400 hover:via-gray-300 hover:to-gray-100 hover:text-transparent hover:bg-clip-text transition-all duration-200 group font-medium mb-6 text-sm"
            >
              <ArrowLeft className="h-4 w-4 text-gray-400 group-hover:-translate-x-1 transition-transform" />
              Back to Upload
            </button>

            {/* Premium Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="premium-box-gradient p-1 w-fit mb-6">
                <TabsTrigger 
                  value="documentation" 
                  className="data-[state=active]:bg-gray-500/20 data-[state=active]:text-gray-300 data-[state=active]:shadow-lg transition-all duration-200 font-medium text-sm"
                >
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  Documentation
                </TabsTrigger>
                <TabsTrigger 
                  value="metrics" 
                  className="data-[state=active]:bg-gray-500/20 data-[state=active]:text-gray-300 data-[state=active]:shadow-lg transition-all duration-200 font-medium text-sm"
                >
                  <BarChart2 className="h-4 w-4 mr-2 text-gray-400" />
                  API Metrics
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="documentation">
                <div className="premium-box-gradient rounded-xl p-8">
                  <SchemaSummary
                    schemaContent={activeSchemaContent}
                  />  
                </div>
              </TabsContent>
              
              <TabsContent value="metrics">
                <div className="premium-box-gradient rounded-xl p-8">
                  <ApiMetrics endpoints={endpoints} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      <ChatWidget schemaContent={activeSchemaContent} />
    </div>
  );
}