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

  return isAuthenticated ? <HomeScreen /> : <LoginScreen />
}

export default function AppShell() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
