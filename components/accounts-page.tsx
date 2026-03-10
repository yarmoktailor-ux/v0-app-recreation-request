"use client"

import { useState } from 'react'
import { ArrowRight, Search, UserPlus, MoreVertical, Phone, Calendar, User, MessageSquare, List, CreditCard } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Transaction {
  id: string
  date: string
  amount: number
  type: 'give' | 'take'
  pricePerPiece: number
  quantity: number
  details: string
  currency: 'local' | 'dollar' | 'saudi'
}

interface Account {
  id: string
  name: string
  phone: string
  balance: number
  transactions: Transaction[]
}

interface AccountsPageProps {
  onBack: () => void
  title: string
  type: 'tailors' | 'workers' | 'suppliers'
}

export function AccountsPage({ onBack, title, type }: AccountsPageProps) {
  const storageKey = `yarmouk-${type}`
  
  const [accounts, setAccounts] = useState<Account[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pricePerPiece: '',
    quantity: 0,
    amount: '',
    details: '',
    date: new Date().toISOString().split('T')[0],
    currency: 'local' as 'local' | 'dollar' | 'saudi'
  })

  const saveAccounts = (newAccounts: Account[]) => {
    setAccounts(newAccounts)
    localStorage.setItem(storageKey, JSON.stringify(newAccounts))
  }

  const handleAdd = () => {
    setFormData({
      name: '',
      phone: '',
      pricePerPiece: '',
      quantity: 0,
      amount: '',
      details: '',
      date: new Date().toISOString().split('T')[0],
      currency: 'local'
    })
    setDialogOpen(true)
  }

  const handleTransaction = (transactionType: 'give' | 'take') => {
    if (!formData.name.trim()) return

    const amount = parseFloat(formData.amount) || (parseFloat(formData.pricePerPiece) * formData.quantity) || 0
    const adjustedAmount = transactionType === 'give' ? -amount : amount

    const existingAccount = accounts.find(a => a.name === formData.name)
    
    const transaction: Transaction = {
      id: Date.now().toString(),
      date: formData.date,
      amount: adjustedAmount,
      type: transactionType,
      pricePerPiece: parseFloat(formData.pricePerPiece) || 0,
      quantity: formData.quantity,
      details: formData.details,
      currency: formData.currency
    }

    if (existingAccount) {
      const updated = accounts.map(a => 
        a.id === existingAccount.id 
          ? { 
              ...a, 
              balance: a.balance + adjustedAmount,
              transactions: [...a.transactions, transaction]
            }
          : a
      )
      saveAccounts(updated)
    } else {
      const newAccount: Account = {
        id: Date.now().toString(),
        name: formData.name,
        phone: formData.phone,
        balance: adjustedAmount,
        transactions: [transaction]
      }
      saveAccounts([...accounts, newAccount])
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
      saveAccounts(accounts.filter(a => a.id !== id))
    }
  }

  const filteredAccounts = accounts.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Tailor/cutter icon SVG
  const TailorIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="9" y1="4" x2="9" y2="9" />
      <line x1="4" y1="14" x2="20" y2="14" />
      <path d="M12 14v6" />
      <circle cx="12" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground h-14 flex items-center px-4 gap-4">
        <button onClick={() => setShowSearch(!showSearch)}>
          <Search className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">{title}</h1>
        <button onClick={onBack}>
          <ArrowRight className="w-6 h-6" />
        </button>
      </header>

      {/* Search Bar */}
      {showSearch && (
        <div className="p-2 bg-primary">
          <Input
            placeholder="بحث..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white text-black"
            autoFocus
          />
        </div>
      )}

      <main className="p-4 pb-24">
        {/* Accounts List */}
        {filteredAccounts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>لا توجد حسابات</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAccounts.map(account => (
              <div 
                key={account.id}
                className="bg-card border-2 border-primary rounded-lg p-3 flex items-center justify-between"
              >
                {/* Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => handleDelete(account.id)}>
                      حذف الحساب
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Balance */}
                <div className={`px-4 py-2 rounded-lg text-white font-bold ${account.balance >= 0 ? 'bg-green-600' : 'bg-black'}`}>
                  {account.balance}
                </div>

                {/* Name */}
                <span className="font-bold text-lg flex-1 text-center">{account.name}</span>

                {/* Icon */}
                <TailorIcon />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={handleAdd}
        className="fixed bottom-6 left-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center"
      >
        <UserPlus className="w-6 h-6" />
      </button>

      {/* Add Transaction Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-background max-w-md p-0">
          <DialogHeader className="bg-primary text-primary-foreground p-4">
            <DialogTitle className="text-center">اضافة حساب جديد</DialogTitle>
          </DialogHeader>
          
          <div className="p-4">
            <div className="border-2 border-primary rounded-xl p-4 space-y-3">
              {/* Account Name */}
              <div className="flex items-center border border-border rounded-full overflow-hidden bg-white">
                <div className="px-3 py-2 border-l border-border">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  placeholder="اسم الحساب"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="border-0 text-center bg-transparent"
                />
              </div>

              {/* Phone */}
              <div className="flex items-center border border-border rounded-full overflow-hidden bg-white">
                <div className="px-3 py-2 border-l border-border">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  placeholder="رقم الهاتف"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="border-0 text-center bg-transparent"
                  inputMode="tel"
                />
              </div>

              {/* Price Per Piece */}
              <div className="flex items-center border border-border rounded-full overflow-hidden bg-white">
                <div className="px-3 py-2 border-l border-border">
                  <List className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  placeholder="سعر شغل القطعة"
                  value={formData.pricePerPiece}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerPiece: e.target.value }))}
                  className="border-0 text-center bg-transparent"
                  inputMode="decimal"
                />
              </div>

              {/* Quantity */}
              <div className="flex items-center border border-border rounded-full overflow-hidden bg-white">
                <div className="px-3 py-2 border-l border-border">
                  <List className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 flex items-center justify-center gap-4 py-1">
                  <span className="text-xs text-muted-foreground">عدد القطع</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(0, prev.quantity - 1) }))}
                      className="w-8 h-8 border rounded flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold">{formData.quantity}</span>
                    <button 
                      onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                      className="w-8 h-8 border rounded flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-center border border-border rounded-full overflow-hidden bg-white">
                <div className="px-3 py-2 border-l border-border">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  placeholder="المبلغ"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="border-0 text-center bg-transparent"
                  inputMode="decimal"
                />
              </div>

              {/* Details */}
              <div className="flex items-center border border-border rounded-full overflow-hidden bg-white">
                <div className="px-3 py-2 border-l border-border">
                  <MessageSquare className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  placeholder="التفاصيل"
                  value={formData.details}
                  onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                  className="border-0 text-center bg-transparent"
                />
              </div>

              {/* Date */}
              <div className="flex items-center border border-border rounded-full overflow-hidden bg-white">
                <div className="px-3 py-2 border-l border-border">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="border-0 text-center bg-transparent"
                />
              </div>

              {/* Currency Selection */}
              <div className="flex justify-center gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span>سعودي</span>
                  <input 
                    type="radio" 
                    name="currency" 
                    checked={formData.currency === 'saudi'}
                    onChange={() => setFormData(prev => ({ ...prev, currency: 'saudi' }))}
                    className="w-5 h-5 accent-primary"
                  />
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span>دولار</span>
                  <input 
                    type="radio" 
                    name="currency" 
                    checked={formData.currency === 'dollar'}
                    onChange={() => setFormData(prev => ({ ...prev, currency: 'dollar' }))}
                    className="w-5 h-5 accent-primary"
                  />
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span>محلي</span>
                  <input 
                    type="radio" 
                    name="currency" 
                    checked={formData.currency === 'local'}
                    onChange={() => setFormData(prev => ({ ...prev, currency: 'local' }))}
                    className="w-5 h-5 accent-primary"
                  />
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={() => handleTransaction('take')}
                  className="flex-1 bg-primary text-primary-foreground rounded-full py-3"
                >
                  أخذت (له)
                </Button>
                <Button 
                  onClick={() => handleTransaction('give')}
                  className="flex-1 bg-primary text-primary-foreground rounded-full py-3"
                >
                  أعطيت (عليه)
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
