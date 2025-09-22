import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, BarChart3, Gamepad2, Bot, Globe } from 'lucide-react';
import { useEffect } from 'react';
import { useMetaverseAdminAuth } from '@/hooks/useMetaverseAdminAuth';
import { AdminSignUpForm } from './components/admin-signup-form';

export default function SignUp() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useMetaverseAdminAuth();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-purple-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent"></div>
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 text-white"
        >
          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-400/30 backdrop-blur-sm">
                <Globe className="h-8 w-8 text-purple-300" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Metaverse Admin
                </h1>
                <p className="text-slate-400 text-lg">Create Your Admin Account</p>
              </div>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed">
              Join the metaverse administration team. Create your admin account to manage users, assets, and virtual worlds.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/15 to-emerald-600/10 border border-emerald-400/20 backdrop-blur-sm">
                <BarChart3 className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-slate-100 font-semibold">Analytics & Insights</h3>
                <p className="text-slate-400 text-sm">Monitor platform performance and user engagement</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/15 to-blue-600/10 border border-blue-400/20 backdrop-blur-sm">
                <Gamepad2 className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <h3 className="text-slate-100 font-semibold">Virtual World Management</h3>
                <p className="text-slate-400 text-sm">Control environments, events, and interactive experiences</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/15 to-orange-600/10 border border-orange-400/20 backdrop-blur-sm">
                <Bot className="h-5 w-5 text-orange-300" />
              </div>
              <div>
                <h3 className="text-slate-100 font-semibold">AI & Automation</h3>
                <p className="text-slate-400 text-sm">Leverage AI tools for content moderation and support</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/15 to-indigo-600/10 border border-indigo-400/20 backdrop-blur-sm">
                <Users className="h-5 w-5 text-indigo-300" />
              </div>
              <div>
                <h3 className="text-slate-100 font-semibold">User & Avatar Management</h3>
                <p className="text-slate-400 text-sm">Oversee user accounts, avatars, and virtual identities</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/15 to-violet-600/10 border border-violet-400/20 backdrop-blur-sm">
                <Globe className="h-5 w-5 text-violet-300" />
              </div>
              <div>
                <h3 className="text-slate-100 font-semibold">NFT & Asset Control</h3>
                <p className="text-slate-400 text-sm">Manage digital assets, NFTs, and virtual economy</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
          >
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Admin Account</h2>
              <p className="text-slate-400">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/sign-in')}
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Sign in here
                </button>
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <AdminSignUpForm />
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400 text-xs font-medium">Secure Registration</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
