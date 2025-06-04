"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bot, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    // Simulate authentication
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('api_whisper_auth', JSON.stringify({
        email,
        authenticated: true,
        timestamp: Date.now()
      }));

      setSuccess('Authentication successful! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (error: any) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-['Inter',_sans-serif] relative overflow-hidden">
      {/* Professional Background with Abstract Curves */}
      <div className="absolute inset-0 z-0">
        {/* Base black background */}
        <div className="absolute inset-0 bg-black"></div>
        
        {/* Top-Left Abstract Curve */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 0.12, scale: 1, rotate: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 pointer-events-none"
        >
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="topLeftGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#525252" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#404040" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#262626" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d="M50,350 Q200,100 350,250 Q300,400 100,300 Q0,200 50,350 Z"
              fill="url(#topLeftGradient)"
              className="animate-pulse"
              style={{ animationDuration: '6s' }}
            />
          </svg>
        </motion.div>

        {/* Bottom-Right Abstract Curve */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
          animate={{ opacity: 0.1, scale: 1, rotate: 0 }}
          transition={{ duration: 2.5, ease: "easeOut", delay: 0.5 }}
          className="absolute -bottom-32 -right-32 w-80 h-80 pointer-events-none"
        >
          <svg
            viewBox="0 0 320 320"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="bottomRightGradient" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#6b7280" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#4b5563" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#374151" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path
              d="M270,50 Q150,200 50,120 Q100,10 200,80 Q320,20 270,50 Z"
              fill="url(#bottomRightGradient)"
              className="animate-pulse"
              style={{ animationDuration: '8s' }}
            />
          </svg>
        </motion.div>

        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-gray-400 via-transparent to-gray-600"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Professional Branding */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-8"
          >
            {/* Logo */}
            <Link href="/auth" className="inline-flex items-center gap-4 group">
              <div className="relative">
                <Bot className="h-14 w-14 text-gray-400 group-hover:rotate-6 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gray-400/20 blur-xl rounded-full group-hover:bg-gray-400/30 transition-all duration-500"></div>
              </div>
              <span className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300">
                API WHISPER
              </span>
            </Link>

            {/* Professional Tagline */}
            <div className="space-y-6 max-w-lg lg:max-w-none">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(255,255,255,0.1)]">
                From Schema to Clarity — Instantly.
              </h1>
              <p className="text-xl lg:text-2xl text-gray-400 font-normal leading-relaxed">
                Generate actionable API documentation in seconds.
              </p>
            </div>

            {/* Professional Feature Highlights */}
            <div className="hidden lg:block space-y-4 pt-8">
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm font-medium">AI-powered documentation generation</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm font-medium">Instant human-readable summaries</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm font-medium">Professional team collaboration</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Professional Auth Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-md">
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="backdrop-blur-xl bg-black/30 border border-gray-700/30 rounded-2xl p-8 shadow-2xl hover:shadow-gray-900/30 transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(31, 31, 31, 0.4) 0%, 
                    rgba(20, 20, 20, 0.6) 50%, 
                    rgba(15, 15, 15, 0.4) 100%)`,
                  boxShadow: `
                    0 25px 50px -12px rgba(0, 0, 0, 0.9),
                    inset 0 1px 0 rgba(255, 255, 255, 0.05),
                    0 0 0 1px rgba(255, 255, 255, 0.02)
                  `
                }}
              >
                {/* Form Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 mb-3">
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-gray-400 text-sm font-medium">
                    {isSignUp ? 'Start generating beautiful API docs' : 'Sign in to continue'}
                  </p>
                </div>

                {/* Success/Error Messages */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 backdrop-blur-sm"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">{error}</span>
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 p-4 mb-6 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 backdrop-blur-sm"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">{success}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Auth Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-gray-300 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/50 border border-gray-600/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400/70 focus:bg-black/70 focus:shadow-lg focus:shadow-gray-500/10 transition-all duration-200 backdrop-blur-sm"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-gray-300 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/50 border border-gray-600/50 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400/70 focus:bg-black/70 focus:shadow-lg focus:shadow-gray-500/10 transition-all duration-200 backdrop-blur-sm"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password (Sign Up only) */}
                  {isSignUp && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3">
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-gray-300 transition-colors" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-black/50 border border-gray-600/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400/70 focus:bg-black/70 focus:shadow-lg focus:shadow-gray-500/10 transition-all duration-200 backdrop-blur-sm"
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button - Professional Gray Gradient */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500 hover:from-gray-600 hover:via-gray-500 hover:to-gray-400 hover:shadow-lg hover:shadow-gray-600/20 disabled:from-gray-800 disabled:via-gray-800 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-sm"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
                      </>
                    ) : (
                      isSignUp ? 'Create Account' : 'Sign In'
                    )}
                  </motion.button>
                </form>

                {/* Toggle Sign Up/Sign In */}
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError('');
                      setSuccess('');
                      setPassword('');
                      setConfirmPassword('');
                    }}
                    className="text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-100 transition-all duration-200 text-sm font-medium"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 