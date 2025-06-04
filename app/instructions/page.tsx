"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, FileText, MessageCircle, Zap, Shield, Globe, BookOpen } from 'lucide-react';
import { useSupabase } from '@/components/supabase-provider';

export default function InstructionsPage() {
  const { user, loading } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen premium-gradient-bg flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen premium-gradient-bg text-white font-['Plus_Jakarta_Sans',_'Inter',_sans-serif]">
      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="flex h-16 items-center px-6">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-400 via-gray-300 to-gray-100 text-transparent bg-clip-text mb-4">
            How to Use API Whisper
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Transform your OpenAPI specifications into human-friendly documentation in seconds
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 md:gap-12">
          {/* Step 1 */}
          <div className="premium-box-gradient rounded-xl p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-300" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">1. Upload Your API Schema</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Start by uploading your OpenAPI/Swagger specification file. You can either drag and drop a JSON/YAML file or paste your schema content directly into the text area.
                </p>
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600/30">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Supported Formats:</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• OpenAPI 3.0+ JSON files</li>
                    <li>• Swagger 2.0 JSON files</li>
                    <li>• Raw JSON content via paste</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="premium-box-gradient rounded-xl p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-gray-300" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">2. AI Processing</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Our AI analyzes your API schema and generates comprehensive, human-friendly documentation. This includes endpoint descriptions, parameter explanations, response formats, and usage examples.
                </p>
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600/30">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">What Gets Generated:</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Clear endpoint descriptions</li>
                    <li>• Parameter documentation</li>
                    <li>• Response format explanations</li>
                    <li>• Code examples and usage tips</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="premium-box-gradient rounded-xl p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-gray-300" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">3. Review Documentation</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Browse through the generated documentation with our clean, organized interface. Switch between documentation view and API metrics to get insights into your API structure.
                </p>
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600/30">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">View Options:</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Documentation tab for detailed descriptions</li>
                    <li>• API Metrics tab for endpoint analytics</li>
                    <li>• Schema History for previous uploads</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="premium-box-gradient rounded-xl p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-gray-300" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">4. Ask Questions</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Use our AI assistant to ask specific questions about your API. Get instant answers about endpoints, authentication, parameters, or request examples.
                </p>
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600/30">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Example Questions:</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• "What does the POST /users endpoint do?"</li>
                    <li>• "How do I authenticate requests?"</li>
                    <li>• "Show me example code for the login endpoint"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="premium-box-gradient rounded-xl p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-gray-300" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Tips for Best Results</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Schema Quality</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Ensure your OpenAPI schema includes detailed descriptions, examples, and proper parameter definitions for the most comprehensive documentation.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">File Size</h3>
                    <p className="text-gray-400 leading-relaxed">
                      For optimal performance, keep your schema files under 1MB. Larger files may take longer to process.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">History Access</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Your uploaded schemas are saved locally for quick access. Use the Schema History panel to quickly switch between different API specifications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/dashboard">
            <button className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-gray-600/25">
              Start Using API Whisper
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 