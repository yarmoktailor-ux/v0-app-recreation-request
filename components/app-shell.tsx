"use client"

import { useState, useEffect } from 'react'
import { AppProvider, useApp } from '@/lib/context'
import { LoginScreen } from '@/components/login-screen'
import { HomeScreen } from '@/components/home-screen'

function AppContent() {
  const { isAuthenticated } = useApp()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return isAuthenticated ? <HomeScreen /> : <LoginScreen />
}

export default function AppShell() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
