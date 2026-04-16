"use client"

import { useState } from 'react'
import { ArrowRight, Search, MoreVertical, Calendar, MessageSquare, List, CreditCard, FileText, Plus } from 'lucide-react'
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
  runningBalance: number
}

interface Account {
  id: string
  name: string
  phone: string
  balance: number
  totalGive: number
  totalTake: number
  transactions: Transaction[]
}

interface AccountsPageProps {
  onBack: () => void
  title: string
  type: 'tailors' | 'workers' | 'suppliers'
}

const TailorIcon = () => (
  <svg width="36" height="36" viewBox="0 0 64 64" fill="none" className="text-primary">
    <circle cx="32" cy="14" r="8" stroke="currentColor" strokeWidth="3" fill="none"/>
    <path d="M16 56 L20 34 L32 40 L44 34 L48 56" stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="round"/>
    <path d="M20 34 L16 26 C16 26 24 22 32 22 C40 22 48 26 48 26 L44 34" stroke="currentColor" strokeWidth="3" fill="none" strokeLinejoin="round"/>
    <line x1="28" y1="40" x2="26" y2="56" stroke="currentColor" strokeWidth="2.5"/>
    <line x1="36" y1="40" x2="38" y2="56" stroke="currentColor" strokeWidth="2.5"/>
  </svg>
)

const PdfIcon = () => (
  <div className="flex flex-col items-center justify-center w-10 h-10 border-2 border-red-500 rounded">
    <FileText className="w-5 h-5 text-red-500" />
    <span className="text-red-500 text-[8px] font-bold leading-none">PDF</span>
  </div>
)

export function AccountsPage({ onBack, title, type }: AccountsPageProps) {
  const storageKey = `yarmouk-${type}`

  const [accounts, setAccounts] = useState<Account[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [formData, setFormData] = useState({
    quantity: 0,
    pricePerPiece: '',
    amount: '',
    details: '',
    date: new Date().toLocaleDateString('en-GB').split('/').reverse().join('-'),
    currency: 'local' as 'local' | 'dollar' | 'saudi'
  })

  const [newAccountDialog, setNewAccountDialog] = useState(false)
  const [newAccountName, setNewAccountName] = useState('')
  const [newAccountPhone, setNewAccountPhone] = useState('')

  const saveAccounts = (newAccounts: Account[]) => {
    setAccounts(newAccounts)
    localStorage.setItem(storageKey, JSON.stringify(newAccounts))
    if (selectedAccount) {
      const updated = newAccounts.find(a => a.id === selectedAccount.id)
      if (updated) setSelectedAccount(updated)
    }
  }

  const handleAddTransaction = (transactionType: 'give' | 'take') => {
    if (!selectedAccount) return
    const amount = parseFloat(formData.amount) ||
      (parseFloat(formData.pricePerPiece) * formData.quantity) || 0
    if (amount === 0) return

    const adjustedAmount = transactionType === 'give' ? -amount : amount
    const newBalance = selectedAccount.balance + adjustedAmount
    const newTotalGive = transactionType === 'give' ? selectedAccount.totalGive + amount : selectedAccount.totalGive
    const newTotalTake = transactionType === 'take' ? selectedAccount.totalTake + amount : selectedAccount.totalTake

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: formData.date,
      amount: adjustedAmount,
      type: transactionType,
      pricePerPiece: parseFloat(formData.pricePerPiece) || 0,
      quantity: formData.quantity,
      details: formData.details,
      currency: formData.currency,
      runningBalance: newBalance
    }

    const updated = accounts.map(a =>
      a.id === selectedAccount.id
        ? { ...a, balance: newBalance, totalGive: newTotalGive, totalTake: newTotalTake, transactions: [...a.transactions, transaction] }
        : a
    )
    saveAccounts(updated)
    setDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      quantity: 0,
      pricePerPiece: '',
      amount: '',
      details: '',
      date: new Date().toLocaleDateString('en-GB').split('/').reverse().join('-'),
      currency: 'local'
    })
  }

  const handleAddNewAccount = () => {
    if (!newAccountName.trim()) return
    const newAccount: Account = {
      id: Date.now().toString(),
      name: newAccountName.trim(),
      phone: newAccountPhone.trim(),
      balance: 0,
      totalGive: 0,
      totalTake: 0,
      transactions: []
    }
    saveAccounts([...accounts, newAccount])
    setNewAccountName('')
    setNewAccountPhone('')
    setNewAccountDialog(false)
  }

  const handleDeleteAccount = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
      saveAccounts(accounts.filter(a => a.id !== id))
    }
  }

  const handleDeleteTransaction = (txId: string) => {
    if (!selectedAccount) return
    const tx = selectedAccount.transactions.find(t => t.id === txId)
    if (!tx) return
    const updated = accounts.map(a =>
      a.id === selectedAccount.id
        ? {
            ...a,
            balance: a.balance - tx.amount,
            totalGive: tx.type === 'give' ? a.totalGive - Math.abs(tx.amount) : a.totalGive,
            totalTake: tx.type === 'take' ? a.totalTake - Math.abs(tx.amount) : a.totalTake,
            transactions: a.transactions.filter(t => t.id !== txId)
          }
        : a
    )
    saveAccounts(updated)
  }

  const handlePrint = (account: Account) => {
    const rows = account.transactions.map(tx => `
      <tr>
        <td style="border:1px solid #ccc;padding:6px;text-align:center">${tx.date}</td>
        <td style="border:1px solid #ccc;padding:6px;text-align:center;color:${tx.amount < 0 ? 'red' : 'green'}">${Math.abs(tx.amount)}</td>
        <td style="border:1px solid #ccc;padding:6px;text-align:center">${tx.details}</td>
        <td style="border:1px solid #ccc;padding:6px;text-align:center">${tx.runningBalance}</td>
      </tr>
    `).join('')

    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>كشف حساب - ${account.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; direction: rtl; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th { background: #c9a227; color: white; padding: 8px; border: 1px solid #ccc; }
          td { padding: 6px; border: 1px solid #ccc; text-align: center; }
          .summary { margin-top: 16px; display: flex; gap: 24px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>كشف حساب: ${account.name}</h2>
        <p style="text-align:center">هاتف: ${account.phone || '-'}</p>
        <table>
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>المبلغ</th>
              <th>التفاصيل</th>
              <th>الرصيد</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="summary">
          <span>اعطيت (عليه): <span style="color:red">${account.totalGive}</span></span>
          <span>أخذت (له): <span style="color:green">${account.totalTake}</span></span>
          <span>الرصيد له: <span style="color:${account.balance < 0 ? 'red' : 'green'}">${account.balance}</span></span>
        </div>
      </body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 300)
  }

  const filteredAccounts = accounts.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ---- DETAIL VIEW ----
  if (selectedAccount) {
    const account = accounts.find(a => a.id === selectedAccount.id) || selectedAccount
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="bg-primary text-primary-foreground h-14 flex items-center px-4 gap-3">
          <button onClick={() => setShowSearch(!showSearch)}>
            <Search className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold flex-1 text-center">{account.name}</h1>
          <button onClick={() => handlePrint(account)}>
            <PdfIcon />
          </button>
          <button onClick={() => setSelectedAccount(null)}>
            <ArrowRight className="w-6 h-6" />
          </button>
        </header>

        {/* Table Header */}
        <div className="grid grid-cols-4 bg-black text-white text-sm font-bold">
          <div className="p-2 text-center border-l border-gray-700">الرصيد</div>
          <div className="p-2 text-center border-l border-gray-700">التفاصيل</div>
          <div className="p-2 text-center border-l border-gray-700">المبلغ</div>
          <div className="p-2 text-center">التاريخ</div>
        </div>

        {/* Transactions */}
        <div className="flex-1 overflow-y-auto">
          {account.transactions.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">لا توجد معاملات</div>
          ) : (
            account.transactions.map((tx, idx) => (
              <div
                key={tx.id}
                className={`grid grid-cols-4 border-b border-border text-sm ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div className="p-2 text-center border-l border-border">{tx.runningBalance}</div>
                <div className="p-2 text-center border-l border-border text-xs">{tx.details}</div>
                <div className={`p-2 text-center border-l border-border font-bold ${tx.amount < 0 ? 'bg-primary text-white' : 'text-green-700'}`}>
                  {Math.abs(tx.amount)}{tx.amount < 0 ? '-' : ''}
                </div>
                <div className="p-2 text-center text-xs">{tx.date}</div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Summary */}
        <div className="bg-black text-white p-3 flex items-center justify-between">
          <button
            onClick={() => { setDialogOpen(true); resetForm() }}
            className="bg-primary rounded-lg p-2"
          >
            <div className="relative">
              <FileText className="w-7 h-7" />
              <Plus className="w-3 h-3 absolute -top-1 -right-1 bg-primary rounded-full" />
            </div>
          </button>
          <div className="text-sm text-center flex-1">
            <div className="flex justify-center gap-4">
              <span>اعطيت (عليه): <span className="text-red-400 font-bold">{account.totalGive}</span></span>
              <span>أخذت (له): <span className="text-primary font-bold">{account.totalTake}</span></span>
            </div>
            <div>الرصيد له: <span className={`font-bold ${account.balance < 0 ? 'text-red-400' : 'text-green-400'}`}>{account.balance}</span></div>
          </div>
        </div>

        {/* Add Transaction Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-background max-w-md p-0 mx-4" aria-describedby={undefined}>
            <DialogHeader className="bg-primary text-primary-foreground p-3 rounded-t-lg">
              <DialogTitle className="text-center font-bold">اضافة عملية جديدة</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <div className="border-2 border-primary rounded-xl p-4 space-y-3 bg-white">

                {/* Name (read-only) */}
                <div className="flex items-center border border-border rounded-full overflow-hidden">
                  <div className="px-3 py-2 border-l bg-gray-50">
                    <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary text-xs font-bold">ع</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center py-2 font-bold text-gray-700">{account.name}</div>
                </div>

                {/* Quantity */}
                <div className="flex items-center border border-border rounded-full overflow-hidden">
                  <div className="px-3 py-2 border-l bg-gray-50">
                    <List className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 flex flex-col items-center py-1">
                    <span className="text-[10px] text-muted-foreground">عدد القطع</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setFormData(p => ({ ...p, quantity: Math.max(0, p.quantity - 1) }))}
                        className="w-8 h-8 border border-border rounded text-lg font-bold flex items-center justify-center">−</button>
                      <span className="w-10 text-center font-bold text-lg">{formData.quantity}</span>
                      <button onClick={() => setFormData(p => ({ ...p, quantity: p.quantity + 1 }))}
                        className="w-8 h-8 border border-border rounded text-lg font-bold flex items-center justify-center">+</button>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center border border-border rounded-full overflow-hidden">
                  <div className="px-3 py-2 border-l bg-gray-50">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <Input placeholder="المبلغ" value={formData.amount}
                    onChange={(e) => setFormData(p => ({ ...p, amount: e.target.value }))}
                    className="border-0 text-center bg-transparent" inputMode="decimal" />
                </div>

                {/* Details */}
                <div className="flex items-center border border-border rounded-full overflow-hidden">
                  <div className="px-3 py-2 border-l bg-gray-50">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <Input placeholder="التفاصيل" value={formData.details}
                    onChange={(e) => setFormData(p => ({ ...p, details: e.target.value }))}
                    className="border-0 text-center bg-transparent" />
                </div>

                {/* Date */}
                <div className="flex items-center border border-border rounded-full overflow-hidden">
                  <div className="px-3 py-2 border-l bg-gray-50">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <Input type="date" value={formData.date}
                    onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                    className="border-0 text-center bg-transparent" />
                </div>

                {/* Currency */}
                <div className="flex justify-center gap-6 py-1">
                  {(['saudi', 'dollar', 'local'] as const).map(c => (
                    <label key={c} className="flex items-center gap-1 cursor-pointer text-sm">
                      <span>{c === 'saudi' ? 'سعودي' : c === 'dollar' ? 'دولار' : 'محلي'}</span>
                      <input type="radio" name="currency" checked={formData.currency === c}
                        onChange={() => setFormData(p => ({ ...p, currency: c }))}
                        className="w-4 h-4 accent-primary" />
                    </label>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button onClick={() => handleAddTransaction('take')}
                    className="flex-1 bg-primary text-primary-foreground rounded-full">
                    أخذت (له)
                  </Button>
                  <Button onClick={() => handleAddTransaction('give')}
                    className="flex-1 bg-primary text-primary-foreground rounded-full"
                    style={{ color: '#dc2626' }}>
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

  // ---- LIST VIEW ----
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground h-14 flex items-center px-4 gap-4">
        <button onClick={() => setShowSearch(!showSearch)}>
          <Search className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">{title}</h1>
        <button onClick={onBack}>
          <ArrowRight className="w-6 h-6" />
        </button>
      </header>

      {showSearch && (
        <div className="p-2 bg-primary">
          <Input placeholder="بحث..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white text-black" autoFocus />
        </div>
      )}

      <main className="p-4 pb-24 space-y-3">
        {filteredAccounts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">لا توجد حسابات</div>
        ) : (
          filteredAccounts.map(account => (
            <div key={account.id}
              className="bg-card border-2 border-primary rounded-lg p-3 flex items-center gap-3">
              {/* Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleDeleteAccount(account.id)}>
                    حذف الحساب
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Balance */}
              <div className={`px-4 py-2 rounded-lg text-white font-bold text-lg min-w-[70px] text-center ${account.balance >= 0 ? 'bg-green-600' : 'bg-black'}`}>
                {account.balance}
              </div>

              {/* Name */}
              <button className="font-bold text-lg flex-1 text-center" onClick={() => setSelectedAccount(account)}>
                {account.name}
              </button>

              {/* Icon - opens detail */}
              <button onClick={() => setSelectedAccount(account)}>
                <TailorIcon />
              </button>
            </div>
          ))
        )}
      </main>

      {/* FAB */}
      <button onClick={() => setNewAccountDialog(true)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center">
        <div className="relative">
          <FileText className="w-7 h-7" />
          <Plus className="w-3 h-3 absolute -top-1 -right-1" />
        </div>
      </button>

      {/* New Account Dialog */}
      <Dialog open={newAccountDialog} onOpenChange={setNewAccountDialog}>
        <DialogContent className="bg-background max-w-sm mx-4" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-center">إضافة حساب جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="اسم الحساب" value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)} autoFocus />
            <Input placeholder="رقم الهاتف (اختياري)" value={newAccountPhone}
              onChange={(e) => setNewAccountPhone(e.target.value)} inputMode="tel" />
            <Button onClick={handleAddNewAccount} className="w-full bg-primary text-primary-foreground">
              إضافة
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
