import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserAuthForm } from './components/user-auth-form';
import { Users, BarChart3, Gamepad2, Bot, Globe,  } from 'lucide-react';
import { useEffect } from 'react';
import { useMetaverseAdminAuth } from '@/hooks/useMetaverseAdminAuth';

export default function SignIn() {
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_theme(colors.purple.500/0.15)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_theme(colors.indigo.500/0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,_theme(colors.violet.500/0.08)_0%,_transparent_50%)]" />

        {/* Animated floating orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 5
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding & Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 xl:p-16"
        >
          <motion.div variants={itemVariants} className="max-w-xl mx-auto">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/15 to-indigo-500/15 border border-purple-400/20 backdrop-blur-sm">
                <Gamepad2 className="h-8 w-8 text-purple-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-100">Metaverse Dashboard</h1>
                <p className="text-slate-400 text-sm">Virtual World Control Center</p>
              </div>
            </div>

            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold text-slate-100 mb-6 leading-tight"
            >
              Control your virtual universe with
              <span className="bg-gradient-to-r from-purple-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent"> immersive power</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-slate-300 text-lg mb-12 leading-relaxed"
            >
              Manage users, monitor virtual worlds, control NFT assets, and oversee your entire metaverse ecosystem from one unified dashboard.
            </motion.p>

            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/15 to-purple-600/10 border border-purple-400/20 backdrop-blur-sm">
                  <BarChart3 className="h-5 w-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-slate-100 font-semibold">Virtual World Analytics</h3>
                  <p className="text-slate-400 text-sm">Monitor user activity, world performance, and engagement metrics</p>
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
        </motion.div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
          >
            {/* Mobile branding */}
            <motion.div
              variants={itemVariants}
              className="lg:hidden text-center mb-8"
            >
              <div className="inline-flex items-center space-x-2 p-3 rounded-2xl bg-gradient-to-r from-slate-800/60 to-slate-700/40 border border-slate-600/30 backdrop-blur-sm mb-4">
                <Bot className="h-6 w-6 text-cyan-300" />
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                  AI Dashboard
                </span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-400">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/sign-up')}
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Create one here
                </button>
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-600/30 p-8 shadow-2xl shadow-black/20"
            >
              <UserAuthForm />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-8 text-center"
            >
              <p className="text-slate-400 text-sm">
                Secured by enterprise-grade authentication
              </p>
              <div className="flex items-center justify-center space-x-4 mt-4">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-cyan-400 text-xs font-medium">System Operational</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
