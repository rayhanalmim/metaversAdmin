import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/icons'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, googleSignIn } = useAuth()
  const navigate = useNavigate()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const success = await login(email, password)
      if (success) {
        navigate('/dashboard')
      } else {
        setError('Invalid credentials or insufficient permissions. Please check your email and password.')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true)
    setError('')

    try {
      const success = await googleSignIn()
      if (success) {
        navigate('/dashboard')
      } else {
        setError('Google sign-in failed or insufficient permissions.')
      }
    } catch (error) {
      setError('Google sign-in failed. Please try again.')
      console.error('Google sign-in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}
          <Button disabled={isLoading || !email.trim() || !password.trim()}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleGoogleSignIn}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        <p>Admin access only. Please use your authorized credentials.</p>
        <p className="mt-1">Default admin: <code className="bg-gray-100 px-1 rounded">222015010@student.green.edu.bd</code></p>
        <p className="text-xs mt-1">Password: <code className="bg-gray-100 px-1 rounded">admin123</code></p>
      </div>
    </div>
  )
}
