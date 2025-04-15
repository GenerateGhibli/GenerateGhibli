'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const t = useTranslations('common')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        router.push('/admin')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      setError('An error occurred during login')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="container py-16 flex justify-center">
      <div className="w-full max-w-md">
        <div className="relative bg-card rounded-3xl border border-border shadow-ghibli p-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ghibli-blue via-ghibli-green to-accent"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <h1 className="text-3xl font-serif font-semibold tracking-wide text-center mb-8 ghibli-title">{t('login')}</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="password" className="block text-base font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  required
                />
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full ghibli-button text-base py-6"
              >
                {isLoading ? 'Loading...' : t('login')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
