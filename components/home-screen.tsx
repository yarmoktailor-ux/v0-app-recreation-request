"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useApp } from '@/lib/context'
import { Sidebar } from '@/components/sidebar'
import { ClientsPage } from '@/components/clients-page'
import { AddClientPage } from '@/components/add-client-page'
import { TrackingPage } from '@/components/tracking-page'
import { AccountsPage } from '@/components/accounts-page'
import { ReportsPage } from '@/components/reports-page'
import { UserSettingsPage } from '@/components/user-settings-page'
import { MeasurementSettingsPage } from '@/components/measurement-settings-page'
import { AboutPage } from '@/components/about-page'
import { BackupPage } from '@/components/backup-page'
import { 
  Menu, 
  MoreVertical, 
  Youtube,
  AlertTriangle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Page = 'home' | 'clients' | 'add-client' | 'tracking' | 'tailors' | 'workers' | 'suppliers' | 'reports' | 'user-settings' | 'measurement-settings' | 'about' | 'backup' | 'restore'

export function HomeScreen() {
  const { 
    clients, 
    newCount, 
    readyCount, 
    deliveredCount,
    shopSettings 
  } = useApp()
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [editingClient, setEditingClient] = useState<string | null>(null)

  // Get clients with delivery date less than 5 days
  const urgentClients = clients.filter(client => {
    return client.measurements.some(m => {
      if (m.status === 'delivered') return false
      const deliveryDate = new Date(m.deliveryDate)
      const today = new Date()
      const diffTime = deliveryDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 5 && diffDays >= 0
    })
  })

  const navigateTo = (page: Page) => {
    setCurrentPage(page)
    setSidebarOpen(false)
  }

  const handleEditClient = (clientId: string) => {
    setEditingClient(clientId)
    setCurrentPage('add-client')
  }

  if (currentPage === 'clients') {
    return (
      <ClientsPage 
        onBack={() => setCurrentPage('home')} 
        onAddClient={() => setCurrentPage('add-client')}
        onEditClient={handleEditClient}
      />
    )
  }

  if (currentPage === 'add-client') {
    return (
      <AddClientPage 
        onBack={() => {
          setCurrentPage('clients')
          setEditingClient(null)
        }}
        editingClientId={editingClient}
      />
    )
  }

  if (currentPage === 'tracking') {
    return <TrackingPage onBack={() => setCurrentPage('home')} />
  }

  if (currentPage === 'tailors') {
    return <AccountsPage onBack={() => setCurrentPage('home')} title="حسابات الخياطين والقصاصين" type="tailors" />
  }

  if (currentPage === 'workers') {
    return <AccountsPage onBack={() => setCurrentPage('home')} title="حسابات العمال" type="workers" />
  }

  if (currentPage === 'suppliers') {
    return <AccountsPage onBack={() => setCurrentPage('home')} title="حسابات الموردين" type="suppliers" />
  }

  if (currentPage === 'reports') {
    return <ReportsPage onBack={() => setCurrentPage('home')} />
  }

  if (currentPage === 'user-settings') {
    return <UserSettingsPage onBack={() => setCurrentPage('home')} />
  }

  if (currentPage === 'measurement-settings') {
    return <MeasurementSettingsPage onBack={() => setCurrentPage('home')} />
  }

  if (currentPage === 'about') {
    return <AboutPage onBack={() => setCurrentPage('home')} />
  }

  if (currentPage === 'backup') {
    return <BackupPage onBack={() => setCurrentPage('home')} type="backup" />
  }

  if (currentPage === 'restore') {
    return <BackupPage onBack={() => setCurrentPage('home')} type="restore" />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground h-14 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
        
        <h1 className="text-lg font-bold">{shopSettings.name}</h1>
        
        <div className="flex items-center gap-2">
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1"
          >
            <Youtube className="w-6 h-6" />
          </a>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1">
                <MoreVertical className="w-6 h-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => navigateTo('settings')}>
                الإعدادات
              </DropdownMenuItem>
              <DropdownMenuItem>
                مشاركة التطبيق
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 relative">
            <Image
              src="/logo.png"
              alt="شعار اليرموك"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          {/* New Measurements */}
          <button 
            onClick={() => navigateTo('clients')}
            className="w-full bg-primary text-primary-foreground rounded-lg p-4 flex items-center justify-between hover:bg-primary/90 transition-colors"
          >
            <span className="text-lg font-bold">{newCount}</span>
            <span className="text-lg">القياسات الجديدة</span>
          </button>

          {/* Ready Measurements */}
          <button 
            onClick={() => navigateTo('clients')}
            className="w-full bg-primary text-primary-foreground rounded-lg p-4 flex items-center justify-between hover:bg-primary/90 transition-colors"
          >
            <span className="text-lg font-bold">{readyCount}</span>
            <span className="text-lg">القياسات الجاهزة</span>
          </button>

          {/* Delivered Measurements */}
          <button 
            onClick={() => navigateTo('clients')}
            className="w-full bg-primary text-primary-foreground rounded-lg p-4 flex items-center justify-between hover:bg-primary/90 transition-colors"
          >
            <span className="text-lg font-bold">{deliveredCount}</span>
            <span className="text-lg">القياسات المسلمة</span>
          </button>
        </div>

        {/* Urgent Deliveries Warning */}
        <div className="w-full max-w-sm mt-8 bg-card rounded-lg border border-border p-4 text-foreground">
          <div className="flex items-center gap-2 text-primary mb-3">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-bold">موعد تسليمها بعد أقل من 5 أيام ولم تنجز</span>
          </div>
          
          {urgentClients.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              لا توجد طلبات عاجلة
            </p>
          ) : (
            <div className="space-y-2">
              {urgentClients.map(client => (
                <button
                  key={client.id}
                  onClick={() => handleEditClient(client.id)}
                  className="w-full text-right p-2 bg-secondary rounded hover:bg-secondary/80 transition-colors"
                >
                  <span className="text-foreground">{client.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onNavigate={navigateTo}
      />
    </div>
  )
}
