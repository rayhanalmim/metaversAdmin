import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/icons'
import { useMetaverseAdminAuth } from '@/hooks/useMetaverseAdminAuth'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2, Copy, Check } from 'lucide-react'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className }: UserAuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const { login, isLoading: authLoading, error: authError } = useMetaverseAdminAuth()
  const navigate = useNavigate()

  // Form validation - for metaverse admin, we use username instead of email
  const isUsernameValid = email.length >= 3 // Using email field for username
  const isPasswordValid = password.length >= 3
  const isFormValid = isUsernameValid && isPasswordValid

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const autofillCredentials = () => {
    setEmail('admin')
    setPassword('admin123')
    setEmailTouched(true)
    setPasswordTouched(true)
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    setError('')

    try {
      const success = await login({ username: email, password })
      if (success) {
        navigate('/dashboard')
      } else {
        setError('Invalid credentials or insufficient permissions. Please verify your admin access.')
      }
    } catch (error) {
      setError('Authentication failed. Please check your connection and try again.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setError('Google authentication is not available for metaverse admin access. Please use username and password.')
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className={cn('space-y-6', className)}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Email Field */}
        <motion.div variants={itemVariants} className="space-y-2">


    
          <Label htmlFor="email" className="text-slate-300 font-medium">
            Username
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              id="email"
              placeholder="admin"
              type="text"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              className={cn(
                "pl-10 pr-10 h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400",
                "focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200",
                emailTouched && !isUsernameValid && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                emailTouched && isUsernameValid && "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              )}
              required
            />
            {emailTouched && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {isUsernameValid ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
          <AnimatePresence>
            {emailTouched && !isUsernameValid && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="h-3 w-3" />
                Please enter a valid username (minimum 3 characters)
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Password Field */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="password" className="text-slate-300 font-medium">
            Password
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              id="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
              className={cn(
                "pl-10 pr-10 h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400",
                "focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200",
                passwordTouched && !isPasswordValid && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                passwordTouched && isPasswordValid && "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              )}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <AnimatePresence>
            {passwordTouched && !isPasswordValid && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="h-3 w-3" />
                Password must be at least 6 characters
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            disabled={isLoading || !isFormValid}
            className={cn(
              "w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
              "disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed",
              "font-semibold text-white shadow-lg transition-all duration-200",
              "focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-slate-800"
            )}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </div>
            ) : (
              'Access Metaverse Dashboard'
            )}
          </Button>
        </motion.div>
      </form>

      {/* Admin Credentials Info */}
      <motion.div variants={itemVariants} className="space-y-4 pt-2">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <p className="text-slate-400 text-xs font-medium">Metaverse Admin Credentials</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={autofillCredentials}
              className="h-6 px-2 text-xs bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20"
            >
              Auto-fill
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 transition-colors group">
              <span className="text-slate-400 text-xs">Username:</span>
              <div className="flex items-center gap-2">
                <code className="text-purple-400 text-xs bg-slate-700/50 px-2 py-1 rounded font-mono">
                  admin
                </code>
                <button
                  onClick={() => copyToClipboard('admin', 'username')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-600/50 rounded"
                >
                  {copiedField === 'username' ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:bg-slate-800/50 transition-colors group">
              <span className="text-slate-400 text-xs">Password:</span>
              <div className="flex items-center gap-2">
                <code className="text-purple-400 text-xs bg-slate-700/50 px-2 py-1 rounded font-mono">
                  admin123
                </code>
                <button
                  onClick={() => copyToClipboard('admin123', 'password')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-600/50 rounded"
                >
                  {copiedField === 'password' ? (
                    <Check className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-3 border-t border-slate-700/50">
          <p className="text-slate-500 text-xs">
            🔒 Admin access only • Enterprise-grade security
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
