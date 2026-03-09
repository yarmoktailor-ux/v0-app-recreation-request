"use client"

import { useState, useEffect } from 'react'
import { LoginScreen } from '@/components/login-screen'
import { HomeScreen } from '@/components/home-screen'

const DEFAULT_PASSWORD = '1234'

export default function AppShell() {
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPasswordState] = useState(DEFAULT_PASSWORD)
  const [clients, setClients] = useState([])
  const [shopSettings, setShopSettings] = useState({
    name: 'اليرموك',
    phone: '773463560',
    address: 'الرياض',
    logo: '/logo.png'
  })

  useEffect(() => {
    setMounted(true)
    // Load from localStorage
    const savedData = localStorage.getItem('yarmouk-app-data')
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        setPasswordState(data.password || DEFAULT_PASSWORD)
        setClients(data.clients || [])
        setShopSettings(data.shopSettings || {
          name: 'اليرموك',
          phone: '773463560',
          address: 'الرياض',
          logo: '/logo.png'
        })
      } catch {
        // Use defaults
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('yarmouk-app-data', JSON.stringify({
      password,
      clients,
      shopSettings
    }))
  }, [mounted, password, clients, shopSettings])

  const login = (pwd: string) => {
    if (pwd === password) {
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
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

  return isAuthenticated ? (
    <HomeScreen 
      clients={clients}
      setClients={setClients}
      shopSettings={shopSettings}
      setShopSettings={setShopSettings}
      password={password}
      setPassword={setPasswordState}
      onLogout={logout}
    />
  ) : (
    <LoginScreen 
      onLogin={login}
      onSetPassword={setPasswordState}
      currentPassword={password}
    />
  )
}
