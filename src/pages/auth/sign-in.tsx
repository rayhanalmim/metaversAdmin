import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserAuthForm } from './components/user-auth-form';
import { Bot } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function SignIn() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative isolate overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-950/20 via-black to-black" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000000,#0f172a,#000000)] opacity-50" />
        <div className="absolute w-full h-full bg-[url('/noise.png')] opacity-[0.15] mix-blend-overlay pointer-events-none" />

        {/* Animated gradient orbs */}
        <div className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute left-[45%] top-[45%] -translate-x-[50%] -translate-y-[50%] w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[128px] animate-pulse delay-700" />
      </div>

      <div className="container relative z-10 mx-auto flex w-full flex-col justify-center space-y-6 max-w-[380px] px-4">
        <div className="flex flex-col space-y-2 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="mx-auto flex items-center space-x-2 backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/10"
          >
            <Bot className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-semibold tracking-tight text-white"
          >
            Admin Access
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-sm text-gray-400"
          >
            Enter your admin token to access the dashboard
          </motion.p>
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full backdrop-blur-xl"
        >
          <UserAuthForm className="bg-black/40 p-6 rounded-2xl border border-white/10 shadow-xl" />
        </motion.div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center text-sm text-gray-400"
        >
          Admin access required for dashboard management
        </motion.p>
      </div>
    </div>
  );
}
