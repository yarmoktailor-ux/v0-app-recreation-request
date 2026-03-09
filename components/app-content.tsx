"use client"

import { useApp } from '@/lib/context'
import { LoginScreen } from '@/components/login-screen'
import { HomeScreen } from '@/components/home-screen'

export default function AppContent() {
  const { isAuthenticated } = useApp()

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return <HomeScreen />
}
