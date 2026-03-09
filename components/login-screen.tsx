"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useApp } from '@/lib/context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Fingerprint, Eye, EyeOff, Lock } from 'lucide-react'

export function LoginScreen() {
  const { login, biometricEnabled, enableBiometric } = useApp()
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleLogin = () => {
    if (login(passwordInput)) {
      setError('')
    } else {
      setError('كلمة السر غير صحيحة')
    }
  }

  const handleBiometricLogin = async () => {
    // Web Biometric API simulation
    // In a real app, you would use the Web Authentication API
    if (biometricEnabled) {
      try {
        // Simulate biometric authentication
        const result = window.confirm('هل تريد الدخول عن طريق البصمة؟')
        if (result) {
          login('1234') // Default password for biometric
        }
      } catch {
        setError('فشل التحقق من البصمة')
      }
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
    // Save password and enable biometric
    enableBiometric(true)
    login(newPassword)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-32 h-32 relative">
          <Image
            src="/logo.png"
            alt="شعار اليرموك"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* App Name */}
      <h1 className="text-3xl font-bold text-primary mb-2">اليرموك</h1>
      <p className="text-muted-foreground mb-8">خياطة وتفصيل</p>

      {!isSettingUp ? (
        <>
          {/* Password Input */}
          <div className="w-full max-w-xs mb-4">
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="كلمة السر"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="pr-10 pl-10 h-12 bg-input text-foreground border-border"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-destructive text-sm mb-4">{error}</p>
          )}

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            className="w-full max-w-xs h-12 bg-primary text-primary-foreground hover:bg-primary/90 mb-6"
          >
            دخول
          </Button>

          {/* Biometric Login */}
          <div className="text-center">
            <button
              onClick={handleBiometricLogin}
              className="flex flex-col items-center gap-2 text-primary hover:opacity-80 transition-opacity"
            >
              <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center">
                <Fingerprint className="w-10 h-10" />
              </div>
              <span className="text-sm">دخول عن طريق البصمة</span>
            </button>
          </div>

          {/* Setup Link */}
          <button
            onClick={() => setIsSettingUp(true)}
            className="mt-8 text-muted-foreground text-sm hover:text-primary"
          >
            إنشاء حساب جديد
          </button>
        </>
      ) : (
        <>
          {/* Setup Password */}
          <div className="w-full max-w-xs space-y-4">
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="كلمة السر الجديدة"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10 h-12 bg-input text-foreground border-border"
              />
            </div>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="تأكيد كلمة السر"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10 h-12 bg-input text-foreground border-border"
              />
            </div>

            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}

            <Button
              onClick={handleSetupPassword}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              إنشاء الحساب
            </Button>

            <button
              onClick={() => {
                setIsSettingUp(false)
                setError('')
              }}
              className="w-full text-muted-foreground text-sm hover:text-primary"
            >
              رجوع
            </button>
          </div>
        </>
      )}
    </div>
  )
}
