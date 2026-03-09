"use client"

import { AppProvider, useApp } from '@/lib/context'
import { LoginScreen } from '@/components/login-screen'
import { HomeScreen } from '@/components/home-screen'

function AppContent() {
  const { isAuthenticated } = useApp()

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
