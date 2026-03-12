'use client'

import { useEffect, useState } from 'react'

export function PWARegister() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // تسجيل Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered:', registration)
        })
        .catch((error) => {
          console.log('[PWA] Service Worker registration failed:', error)
        })
    }

    // كشف إمكانية تثبيت التطبيق
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // كشف عند تثبيت التطبيق
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully')
      setIsInstallable(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('[PWA] User accepted installation')
      setDeferredPrompt(null)
      setIsInstallable(false)
    } else {
      console.log('[PWA] User dismissed installation')
    }
  }

  // لا تعرض أي شيء إذا لم يكن التطبيق قابل للتثبيت
  if (!isInstallable) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-primary text-primary-foreground rounded-lg p-4 shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom">
      <div className="flex-1">
        <p className="font-semibold text-sm">تثبيت التطبيق</p>
        <p className="text-xs opacity-90">ثبّت التطبيق على شاشتك الرئيسية للوصول السريع</p>
      </div>
      <button
        onClick={handleInstall}
        className="flex-shrink-0 px-4 py-2 bg-white text-primary rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
      >
        تثبيت
      </button>
      <button
        onClick={() => setIsInstallable(false)}
        className="flex-shrink-0 text-white hover:opacity-70 transition-opacity"
      >
        ✕
      </button>
    </div>
  )
}
