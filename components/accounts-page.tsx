"use client"

import { useState } from 'react'
import { ArrowRight, Plus, Trash2, Edit } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface Account {
  id: string
  name: string
  phone: string
  balance: number
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
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [formData, setFormData] = useState({ name: '', phone: '', balance: 0 })

  const saveAccounts = (newAccounts: Account[]) => {
    setAccounts(newAccounts)
    localStorage.setItem(storageKey, JSON.stringify(newAccounts))
  }

  const handleAdd = () => {
    setEditingAccount(null)
    setFormData({ name: '', phone: '', balance: 0 })
    setDialogOpen(true)
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    setFormData({ name: account.name, phone: account.phone, balance: account.balance })
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editingAccount) {
      const updated = accounts.map(a => 
        a.id === editingAccount.id 
          ? { ...a, ...formData }
          : a
      )
      saveAccounts(updated)
    } else {
      const newAccount: Account = {
        id: Date.now().toString(),
        ...formData
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

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground h-14 flex items-center px-4 gap-4">
        <button onClick={onBack}>
          <ArrowRight className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold flex-1">{title}</h1>
        <button onClick={handleAdd} className="p-1">
          <Plus className="w-6 h-6" />
        </button>
      </header>

      <main className="p-4">
        {/* Summary */}
        <div className="bg-primary text-primary-foreground rounded-lg p-4 mb-4 text-center">
          <p className="text-sm">إجمالي الرصيد</p>
          <p className="text-2xl font-bold">{totalBalance.toFixed(2)} ر.س</p>
        </div>

        {/* Accounts List */}
        {accounts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>لا توجد حسابات</p>
            <Button onClick={handleAdd} className="mt-4">
              <Plus className="w-4 h-4 ml-2" />
              إضافة حساب جديد
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {accounts.map(account => (
              <div 
                key={account.id}
                className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(account)} className="text-primary">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(account.id)} className="text-destructive">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold">{account.name}</p>
                  <p className="text-sm text-muted-foreground">{account.phone}</p>
                  <p className={`text-sm ${account.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {account.balance.toFixed(2)} ر.س
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-popover">
          <DialogHeader>
            <DialogTitle>{editingAccount ? 'تعديل الحساب' : 'إضافة حساب جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium block mb-2">الاسم</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">رقم الهاتف</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                inputMode="tel"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">الرصيد</label>
              <Input
                type="text"
                value={formData.balance || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
                inputMode="decimal"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
