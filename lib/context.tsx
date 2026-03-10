"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Types
export interface Measurement {
  id: string
  clientId: string
  type: 'thobe' | 'khaleeji' | 'suit'
  fabricType: string
  quantity: number
  price: number
  paid: number
  remaining: number
  tax: number
  discount: number
  discountType: 'percentage' | 'amount'
  measurements: Record<string, string>
  details: Record<string, string[]>
  notes: string
  deliveryDate: string
  createdAt: string
  status: 'new' | 'in-progress' | 'ready' | 'delivered'
}

export interface Payment {
  id: string
  clientId: string
  amount: number
  remaining: number
  type: 'initial' | 'delivery' | 'edit'
  date: string
}

export interface Client {
  id: string
  number: number
  name: string
  phone: string
  measurements: Measurement[]
  payments: Payment[]
  createdAt: string
}

export interface ShopSettings {
  name: string
  phone: string
  address: string
  logo: string
}

interface AppContextType {
  // Auth
  isAuthenticated: boolean
  password: string
  login: (password: string) => boolean
  logout: () => void
  setPassword: (password: string) => void
  
  // Clients
  clients: Client[]
  addClient: (client: Omit<Client, 'id' | 'number' | 'createdAt' | 'payments'>) => Client
  updateClient: (id: string, client: Partial<Client>) => void
  deleteClient: (id: string) => void
  getClient: (id: string) => Client | undefined
  
  // Measurements
  addMeasurement: (clientId: string, measurement: Omit<Measurement, 'id' | 'createdAt'>) => void
  updateMeasurement: (clientId: string, measurementId: string, measurement: Partial<Measurement>) => void
  updateMeasurementStatus: (clientId: string, measurementId: string, status: Measurement['status']) => void
  
  // Payments
  addPayment: (clientId: string, amount: number) => void
  
  // Counters
  newCount: number
  inProgressCount: number
  readyCount: number
  deliveredCount: number
  
  // Settings
  shopSettings: ShopSettings
  updateShopSettings: (settings: Partial<ShopSettings>) => void
  
  // Fabric Types
  fabricTypes: string[]
  addFabricType: (type: string) => void
  updateFabricType: (oldType: string, newType: string) => void
  removeFabricType: (type: string) => void
  
  // Options Lists
  optionLists: Record<string, string[]>
  addOptionToList: (listName: string, option: string) => void
  updateOptionInList: (listName: string, oldOption: string, newOption: string) => void
  removeOptionFromList: (listName: string, option: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const DEFAULT_PASSWORD = '1234'

const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  name: 'خياط اليرموك',
  phone: '773463560',
  address: 'صنعاء - الاصبحي - مجمع مهدي الراعي',
  logo: '/logo.png'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPasswordState] = useState(DEFAULT_PASSWORD)
  const [clients, setClients] = useState<Client[]>([])
  const [shopSettings, setShopSettings] = useState<ShopSettings>(DEFAULT_SHOP_SETTINGS)
  const [fabricTypes, setFabricTypes] = useState<string[]>([])
  const [optionLists, setOptionLists] = useState<Record<string, string[]>>({
    neckType: [],
    jabzor: [],
    hand: [],
    button: [],
    tailoringType: [],
    pockets: []
  })

  // Mark as mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load from localStorage
  useEffect(() => {
    if (!mounted) return
    const savedData = localStorage.getItem('yarmouk-app-data')
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        setPasswordState(data.password || DEFAULT_PASSWORD)
        setClients(data.clients || [])
        setShopSettings(data.shopSettings || DEFAULT_SHOP_SETTINGS)
        setFabricTypes(data.fabricTypes || [])
        setOptionLists(data.optionLists || {
          neckType: [],
          jabzor: [],
          hand: [],
          button: [],
          tailoringType: [],
          pockets: []
        })
      } catch {
        // Invalid data, use defaults
      }
    }
  }, [mounted])

  // Save to localStorage
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('yarmouk-app-data', JSON.stringify({
      password,
      clients,
      shopSettings,
      fabricTypes,
      optionLists
    }))
  }, [mounted, password, clients, shopSettings, fabricTypes, optionLists])

  // Auth functions
  const login = (inputPassword: string) => {
    if (inputPassword === password) {
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
  }

  const setPassword = (newPassword: string) => {
    setPasswordState(newPassword)
  }

  // Client functions
  const addClient = (clientData: Omit<Client, 'id' | 'number' | 'createdAt' | 'payments'>) => {
    const newClient: Client = {
      ...clientData,
      id: crypto.randomUUID(),
      number: clients.length + 1,
      createdAt: new Date().toISOString(),
      payments: []
    }
    setClients(prev => [...prev, newClient])
    return newClient
  }

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...clientData } : c))
  }

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id))
  }

  const getClient = (id: string) => {
    return clients.find(c => c.id === id)
  }

  // Measurement functions
  const addMeasurement = (clientId: string, measurementData: Omit<Measurement, 'id' | 'createdAt'>) => {
    const newMeasurement: Measurement = {
      ...measurementData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return { ...c, measurements: [...c.measurements, newMeasurement] }
      }
      return c
    }))
  }

  const updateMeasurement = (clientId: string, measurementId: string, measurementData: Partial<Measurement>) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          measurements: c.measurements.map(m => 
            m.id === measurementId ? { ...m, ...measurementData } : m
          )
        }
      }
      return c
    }))
  }

  const updateMeasurementStatus = (clientId: string, measurementId: string, status: Measurement['status']) => {
    updateMeasurement(clientId, measurementId, { status })
  }

  // Payment functions
  const addPayment = (clientId: string, amount: number) => {
    const payment: Payment = {
      id: crypto.randomUUID(),
      clientId,
      amount,
      remaining: 0,
      type: 'delivery',
      date: new Date().toISOString()
    }
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        // Update the measurement's paid amount
        const updatedMeasurements = c.measurements.map(m => {
          if (m.status !== 'delivered') {
            const newPaid = m.paid + amount
            return { ...m, paid: newPaid, remaining: m.price - newPaid }
          }
          return m
        })
        return { 
          ...c, 
          payments: [...c.payments, payment],
          measurements: updatedMeasurements
        }
      }
      return c
    }))
  }

  // Calculate counters
  const newCount = clients.reduce((acc, c) => 
    acc + c.measurements.filter(m => m.status === 'new').length, 0)
  const inProgressCount = clients.reduce((acc, c) => 
    acc + c.measurements.filter(m => m.status === 'in-progress').length, 0)
  const readyCount = clients.reduce((acc, c) => 
    acc + c.measurements.filter(m => m.status === 'ready').length, 0)
  const deliveredCount = clients.reduce((acc, c) => 
    acc + c.measurements.filter(m => m.status === 'delivered').length, 0)

  // Settings functions
  const updateShopSettings = (settings: Partial<ShopSettings>) => {
    setShopSettings(prev => ({ ...prev, ...settings }))
  }

  // Fabric types
  const addFabricType = (type: string) => {
    if (!fabricTypes.includes(type)) {
      setFabricTypes(prev => [...prev, type])
    }
  }

  const updateFabricType = (oldType: string, newType: string) => {
    setFabricTypes(prev => prev.map(t => t === oldType ? newType : t))
  }

  const removeFabricType = (type: string) => {
    setFabricTypes(prev => prev.filter(t => t !== type))
  }

  // Option lists
  const addOptionToList = (listName: string, option: string) => {
    setOptionLists(prev => ({
      ...prev,
      [listName]: [...(prev[listName] || []), option]
    }))
  }

  const updateOptionInList = (listName: string, oldOption: string, newOption: string) => {
    setOptionLists(prev => ({
      ...prev,
      [listName]: (prev[listName] || []).map(o => o === oldOption ? newOption : o)
    }))
  }

  const removeOptionFromList = (listName: string, option: string) => {
    setOptionLists(prev => ({
      ...prev,
      [listName]: (prev[listName] || []).filter(o => o !== option)
    }))
  }

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      password,
      login,
      logout,
      setPassword,
      clients,
      addClient,
      updateClient,
      deleteClient,
      getClient,
      addMeasurement,
      updateMeasurement,
      updateMeasurementStatus,
      addPayment,
      newCount,
      inProgressCount,
      readyCount,
      deliveredCount,
      shopSettings,
      updateShopSettings,
      fabricTypes,
      addFabricType,
      updateFabricType,
      removeFabricType,
      optionLists,
      addOptionToList,
      updateOptionInList,
      removeOptionFromList
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
