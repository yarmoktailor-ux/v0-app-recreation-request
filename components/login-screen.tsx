"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

interface LoginScreenProps {
  onLogin: (password: string) => boolean
  onSetPassword: (password: string) => void
  currentPassword: string
}

export function LoginScreen({ onLogin, onSetPassword, currentPassword }: LoginScreenProps) {
  const [mounted, setMounted] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = () => {
    if (onLogin(passwordInput)) {
      setError('')
    } else {
      setError('كلمة السر غير صحيحة')
    }
  }

  const handleSetupPassword = () => {
    if (newPassword.length < 4) {
      setError('كلمة السر يجب أن تكون 4 أرقام على الأقل')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('كلمة السر غير متطابقة')
      return
    }
    
    onSetPassword(newPassword)
    onLogin(newPassword)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground" suppressHydrationWarning>
      {/* Logo */}
      <div className="w-24 h-24 relative mb-6">
        <Image
          src="/logo.png"
          alt="اليرموك"
          fill
          className="object-contain"
          priority
        />
      </div>

      <h1 className="text-3xl font-bold text-primary mb-2">اليرموك</h1>
      <p className="text-muted-foreground mb-8">خياطة وتفصيل</p>

      {/* Setup Mode */}
      {isSettingUp ? (
        <div className="w-full max-w-sm space-y-4">
          <h2 className="text-xl font-bold text-center mb-6">إنشاء حساب جديد</h2>

          <div className="bg-card border border-border rounded-lg p-4">
            <Input
              type="text"
              placeholder="كلمة السر الجديدة"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full"
              inputMode="numeric"
            />
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <Input
              type="text"
              placeholder="تأكيد كلمة السر"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
              inputMode="numeric"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <Button
            onClick={handleSetupPassword}
            className="w-full bg-primary text-primary-foreground"
          >
            حفظ
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setIsSettingUp(false)
              setError('')
              setNewPassword('')
              setConfirmPassword('')
            }}
            className="w-full"
          >
            إلغاء
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-4">
          {/* Password Input */}
          <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <span className="text-primary">🔒</span>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="كلمة السر"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="border-0 bg-transparent"
              inputMode="numeric"
              autoFocus
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-muted-foreground"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            className="w-full bg-primary text-primary-foreground"
          >
            دخول
          </Button>

          {/* Setup Link */}
          <button
            onClick={() => setIsSettingUp(true)}
            className="mt-8 text-muted-foreground text-sm hover:text-primary w-full"
          >
            إنشاء حساب جديد
          </button>
        </div>
      )}
    </div>
  )
}
