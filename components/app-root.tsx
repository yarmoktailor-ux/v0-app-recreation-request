"use client"

import { AppProvider, useApp } from '@/lib/context'
import { LoginScreen } from '@/components/login-screen'
import { HomeScreen } from '@/components/home-screen'

function AppContent() {
  const { isAuthenticated } = useApp()
  return isAuthenticated ? <HomeScreen /> : <LoginScreen />
}

export default function AppRoot() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
