"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useApp } from '@/lib/context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Fingerprint, Eye, EyeOff, Lock } from 'lucide-react'

export function LoginScreen() {
  const { login, biometricEnabled, enableBiometric, setPassword, password } = useApp()
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
    if (login(passwordInput)) {
      setError('')
    } else {
      setError('كلمة السر غير صحيحة')
    }
  }

  const handleBiometricLogin = async () => {
    if (!biometricEnabled) {
      setError('يرجى تفعيل البصمة أولاً من إعدادات الحساب')
      return
    }

    try {
      // Check if Web Authentication API is available
      if (window.PublicKeyCredential) {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        if (available) {
          // Use Web Authentication API for biometric
          const credential = await navigator.credentials.get({
            publicKey: {
              challenge: new Uint8Array(32),
              timeout: 60000,
              userVerification: 'required',
              rpId: window.location.hostname,
            }
          }).catch(() => null)

          if (credential) {
            login(password)
            return
          }
        }
      }

      // Fallback: Use simple confirmation for browsers without WebAuthn
      const result = window.confirm('هل تريد الدخول عن طريق البصمة؟')
      if (result) {
        login(password)
      }
    } catch {
      setError('فشل التحقق من البصمة')
    }
  }

  const handleEnableBiometric = async () => {
    try {
      // Check if Web Authentication API is available
      if (window.PublicKeyCredential) {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        if (available) {
          // Register biometric credential
          const credential = await navigator.credentials.create({
            publicKey: {
              challenge: new Uint8Array(32),
              rp: { name: 'اليرموك', id: window.location.hostname },
              user: {
                id: new Uint8Array(16),
                name: 'user@yarmouk.app',
                displayName: 'مستخدم اليرموك'
              },
              pubKeyCredParams: [
                { alg: -7, type: 'public-key' },
                { alg: -257, type: 'public-key' }
              ],
              authenticatorSelection: {
                authenticatorAttachment: 'platform',
                userVerification: 'required'
              },
              timeout: 60000,
            }
          }).catch(() => null)

          if (credential) {
            enableBiometric(true)
            setError('')
            return true
          }
        }
      }

      // Fallback: Enable biometric without actual registration
      enableBiometric(true)
      return true
    } catch {
      setError('فشل تفعيل البصمة')
      return false
    }
  }

  const handleSetupPassword = async () => {
    if (newPassword.length < 4) {
      setError('كلمة السر يجب أن تكون 4 أرقام على الأقل')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('كلمة السر غير متطابقة')
      return
    }
    
    // Save the new password
    setPassword(newPassword)
    
    // Ask to enable biometric
    const wantBiometric = window.confirm('هل تريد تفعيل الدخول عن طريق البصمة؟')
    if (wantBiometric) {
      await handleEnableBiometric()
    }
    
    login(newPassword)
  }

  if (!mounted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#ffffff', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ 
          width: 48, 
          height: 48, 
          border: '4px solid #d4af37', 
          borderTopColor: 'transparent', 
          borderRadius: '50%', 
          animation: 'spin 0.8s linear infinite' 
        }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground" suppressHydrationWarning>
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
