"use client"

import dynamic from 'next/dynamic'
import { AppProvider } from '@/lib/context'

const AppContent = dynamic(() => import('@/components/app-content'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
    </div>
  )
})

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
