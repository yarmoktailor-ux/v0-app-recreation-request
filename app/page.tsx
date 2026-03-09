"use client"

import { useState, useEffect } from 'react'
import { AppProvider, useApp } from '@/lib/context'
import { LoginScreen } from '@/components/login-screen'
import { HomeScreen } from '@/components/home-screen'
import Image from 'next/image'

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center">
      <div className="w-32 h-32 relative mb-4">
        <Image
          src="/logo.png"
          alt="اليرموك"
          fill
          className="object-contain"
          priority
        />
      </div>
      <h1 className="text-2xl font-bold text-[#d4af37]">اليرموك</h1>
      <p className="text-gray-400 mt-2">جاري التحميل...</p>
    </div>
  )
}

function AppContent() {
  const { isAuthenticated } = useApp()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return <HomeScreen />
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
