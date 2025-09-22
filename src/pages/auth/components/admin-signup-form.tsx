import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'
import axios from 'axios'

interface AdminSignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminSignUpForm({ className, ...props }: AdminSignUpFormProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form validation states
  const [usernameTouched, setUsernameTouched] = useState(false)
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false)

  const navigate = useNavigate()

  // Validation functions
  const isUsernameValid = username.length >= 3
  const isEmailValid = email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isPasswordValid = password.length >= 6
  const isConfirmPasswordValid = confirmPassword === password && password.length > 0
  const isFormValid = isUsernameValid && isPasswordValid && isConfirmPasswordValid && (email.length === 0 || isEmailValid)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.post('http://localhost:3000/api/admin/signup', {
        username,
        password,
        email: email || null
      })

      if (response.data.success) {
        setSuccess('Admin account created successfully! You can now sign in.')
        setTimeout(() => {
          navigate('/sign-in')
        }, 2000)
      } else {
        setError(response.data.message || 'Failed to create account')
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Failed to create account. Please try again.')
      }
      console.error('Signup error:', error)
    } finally {
      setIsLoading(false)
    }
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
      {...props}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Username Field */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="username" className="text-slate-300 font-medium">
            Username *
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              id="username"
              placeholder="Enter username"
              type="text"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isLoading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => setUsernameTouched(true)}
              className={cn(
                "pl-10 pr-10 h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400",
                "focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200",
                usernameTouched && !isUsernameValid && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                usernameTouched && isUsernameValid && "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              )}
              required
            />
            {usernameTouched && isUsernameValid && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
            )}
          </div>
          <AnimatePresence>
            {usernameTouched && !isUsernameValid && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="h-3 w-3" />
                Username must be at least 3 characters
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Email Field */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="email" className="text-slate-300 font-medium">
            Email (Optional)
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              id="email"
              placeholder="Enter email address"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              className={cn(
                "pl-10 pr-10 h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400",
                "focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200",
                emailTouched && email.length > 0 && !isEmailValid && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                emailTouched && isEmailValid && email.length > 0 && "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              )}
            />
            {emailTouched && isEmailValid && email.length > 0 && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
            )}
          </div>
          <AnimatePresence>
            {emailTouched && email.length > 0 && !isEmailValid && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="h-3 w-3" />
                Please enter a valid email address
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Password Field */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="password" className="text-slate-300 font-medium">
            Password *
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
              autoComplete="new-password"
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

        {/* Confirm Password Field */}
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-slate-300 font-medium">
            Confirm Password *
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              id="confirmPassword"
              placeholder="Confirm your password"
              type={showConfirmPassword ? "text" : "password"}
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              disabled={isLoading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setConfirmPasswordTouched(true)}
              className={cn(
                "pl-10 pr-10 h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400",
                "focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200",
                confirmPasswordTouched && !isConfirmPasswordValid && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                confirmPasswordTouched && isConfirmPasswordValid && "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20"
              )}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <AnimatePresence>
            {confirmPasswordTouched && !isConfirmPasswordValid && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="h-3 w-3" />
                Passwords do not match
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-start gap-2"
            >
              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

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
                Creating Account...
              </div>
            ) : (
              'Create Admin Account'
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}