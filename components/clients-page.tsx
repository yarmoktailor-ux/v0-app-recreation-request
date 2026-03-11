"use client"

import { useState, useRef } from 'react'
import { useApp, Client, Measurement } from '@/lib/context'
import { 
  ArrowRight, 
  Search, 
  UserPlus,
  Printer,
  Mail,
  Check,
  MoreVertical,
  Users,
  X
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { ClientInvoice, MeasurementInvoice } from './invoice'

interface ClientsPageProps {
  onBack: () => void
  onAddClient: () => void
  onEditClient: (clientId: string) => void
}

export function ClientsPage({ onBack, onAddClient, onEditClient }: ClientsPageProps) {
  const { clients, deleteClient, updateMeasurementStatus, addPayment, shopSettings } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [currentTab, setCurrentTab] = useState<'new' | 'ready' | 'delivered'>('new')
  const [statusDialog, setStatusDialog] = useState<{ open: boolean; clientId: string; measurementId: string }>({ 
    open: false, 
    clientId: '', 
    measurementId: '' 
  })
  const [deliverDialog, setDeliverDialog] = useState<{ open: boolean; client: Client | null; remaining: number }>({ 
    open: false, 
    client: null, 
    remaining: 0 
  })
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; client: Client | null }>({ 
    open: false, 
    client: null 
  })
  const [selectedStatus, setSelectedStatus] = useState<'new' | 'in-progress' | 'ready' | 'delivered'>('new')
  const [invoiceDialog, setInvoiceDialog] = useState<{ 
    open: boolean; 
    type: 'client' | 'measurement'; 
    client: Client | null;
    measurement: Measurement | null;
  }>({ 
    open: false, 
    type: 'client', 
    client: null,
    measurement: null 
  })
  const [paymentDialog, setPaymentDialog] = useState<{ 
    open: boolean; 
    client: Client | null;
    amount: string;
  }>({ 
    open: false, 
    client: null,
    amount: '' 
  })
  const invoiceRef = useRef<HTMLDivElement>(null)

  // Filter clients based on latest measurement status
  const filteredClientsByTab = clients.filter(client => {
    const latestMeasurement = client.measurements[client.measurements.length - 1]
    if (!latestMeasurement) return false
    
    if (currentTab === 'new') return latestMeasurement.status === 'new'
    if (currentTab === 'ready') return latestMeasurement.status === 'ready'
    if (currentTab === 'delivered') return latestMeasurement.status === 'delivered'
    return false
  })

  const filteredClients = filteredClientsByTab.filter(client => 
    client.name.includes(searchQuery) || client.phone.includes(searchQuery)
  )

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'مقاسات جديدة'
      case 'in-progress': return 'مقاسات تحت العمل'
      case 'ready': return 'مقاسات جاهزة'
      case 'delivered': return 'تم التسليم'
      default: return status
    }
  }

  const handleStatusChange = () => {
    if (statusDialog.clientId && statusDialog.measurementId) {
      updateMeasurementStatus(statusDialog.clientId, statusDialog.measurementId, selectedStatus)
      setStatusDialog({ open: false, clientId: '', measurementId: '' })
    }
  }

  const handleDeliver = (withPayment: boolean) => {
    if (deliverDialog.client) {
      const client = deliverDialog.client
      const measurement = client.measurements.find(m => m.status !== 'delivered')
      if (measurement) {
        if (withPayment && deliverDialog.remaining > 0) {
          addPayment(client.id, deliverDialog.remaining)
        }
        updateMeasurementStatus(client.id, measurement.id, 'delivered')
      }
      setDeliverDialog({ open: false, client: null, remaining: 0 })
    }
  }

  const handleDelete = () => {
    if (deleteDialog.client) {
      deleteClient(deleteDialog.client.id)
      setDeleteDialog({ open: false, client: null })
    }
  }

  const openDeliverDialog = (client: Client) => {
    const measurement = client.measurements.find(m => m.status !== 'delivered')
    const remaining = measurement ? measurement.remaining : 0
    setDeliverDialog({ open: true, client, remaining })
  }

  const openPaymentDialog = (client: Client) => {
    const measurement = client.measurements.find(m => m.status !== 'delivered')
    const remaining = measurement ? measurement.remaining : 0
    setPaymentDialog({ open: true, client, amount: remaining.toString() })
  }

  const handlePayment = () => {
    if (paymentDialog.client && paymentDialog.amount) {
      addPayment(paymentDialog.client.id, parseFloat(paymentDialog.amount))
      setPaymentDialog({ open: false, client: null, amount: '' })
    }
  }

  const openStatusDialog = (client: Client) => {
    const measurement = client.measurements[0]
    if (measurement) {
      setSelectedStatus(measurement.status)
      setStatusDialog({ open: true, clientId: client.id, measurementId: measurement.id })
    }
  }
  
  const openInvoiceDialog = (client: Client, type: 'client' | 'measurement') => {
    const measurement = client.measurements[client.measurements.length - 1]
    if (measurement) {
      setInvoiceDialog({ open: true, type, client, measurement })
    }
  }

  const handlePrint = () => {
    if (invoiceRef.current) {
      const printContent = invoiceRef.current.innerHTML
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <title>فاتورة</title>
            <meta charset="UTF-8">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: 'Cairo', 'Arial', sans-serif; 
                padding: 20px;
                direction: rtl;
                color: #000;
              }
              .bg-white { background: white; }
              .p-6 { padding: 1.5rem; }
              .p-3 { padding: 0.75rem; }
              .p-2 { padding: 0.5rem; }
              .mb-6 { margin-bottom: 1.5rem; }
              .mb-4 { margin-bottom: 1rem; }
              .mb-3 { margin-bottom: 0.75rem; }
              .mb-2 { margin-bottom: 0.5rem; }
              .mb-1 { margin-bottom: 0.25rem; }
              .mx-auto { margin-left: auto; margin-right: auto; }
              .text-center { text-align: center; }
              .text-xl { font-size: 1.25rem; }
              .text-sm { font-size: 0.875rem; }
              .text-xs { font-size: 0.75rem; }
              .font-bold { font-weight: bold; }
              .text-gray-500 { color: #6b7280; }
              .text-gray-600 { color: #4b5563; }
              .text-red-600 { color: #dc2626; }
              .border { border: 1px solid #d1d5db; }
              .border-gray-300 { border-color: #d1d5db; }
              .border-gray-200 { border-color: #e5e7eb; }
              .rounded { border-radius: 0.25rem; }
              .space-y-3 > * + * { margin-top: 0.75rem; }
              .grid { display: grid; }
              .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
              .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
              .gap-2 { gap: 0.5rem; }
              .flex { display: flex; }
              .justify-between { justify-content: space-between; }
              .justify-center { justify-content: center; }
              .block { display: block; }
              .w-20 { width: 5rem; }
              .h-20 { height: 5rem; }
              .max-w-md { max-width: 28rem; }
              img { max-width: 100%; height: auto; object-fit: contain; }
              .bg-gray-100 { background: #f3f4f6; }
              .-mx-3 { margin-left: -0.75rem; margin-right: -0.75rem; }
              .-mt-3 { margin-top: -0.75rem; }
              @media print {
                body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 250)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground h-14 flex items-center justify-between px-4">
        <button onClick={onBack}>
          <ArrowRight className="w-6 h-6" />
        </button>
        
        {showSearch ? (
          <Input
            placeholder="بحث بالاسم أو رقم الهاتف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 mx-4 h-8 bg-white text-black"
            autoFocus
          />
        ) : (
          <h1 className="text-lg font-bold">العملاء</h1>
        )}
        
        <button onClick={() => setShowSearch(!showSearch)}>
          <Search className="w-6 h-6" />
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-4 border-b border-border bg-card overflow-x-auto">
        <button
          onClick={() => setCurrentTab('new')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
            currentTab === 'new' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-foreground'
          }`}
        >
          مقاسات جديدة
        </button>
        <button
          onClick={() => setCurrentTab('ready')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
            currentTab === 'ready' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-foreground'
          }`}
        >
          مقاسات جاهزة
        </button>
        <button
          onClick={() => setCurrentTab('delivered')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
            currentTab === 'delivered' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-foreground'
          }`}
        >
          مقاسات مسلمة
        </button>
      </div>

      {/* Content */}
      <main className="p-4">
        {filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Users className="w-20 h-20 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-2">
              {currentTab === 'new' ? 'لا توجد مقاسات جديدة' : currentTab === 'ready' ? 'لا توجد مقاسات جاهزة' : 'لا توجد مقاسات مسلمة'}
            </p>
            {currentTab === 'new' && (
              <button
                onClick={onAddClient}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                إضافة عميل جديد
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredClients.map(client => {
              const latestMeasurement = client.measurements[client.measurements.length - 1]
              return (
                <div 
                  key={client.id}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    {/* Client Number Badge */}
                    <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="text-center">
                        <div className="w-8 h-6 border-2 border-muted-foreground rounded-t-lg relative">
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-muted-foreground rounded-b" />
                        </div>
                        <span className="text-xs text-primary font-bold">{client.number}</span>
                      </div>
                    </div>

                    {/* Client Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{client.name}</h3>
                      {latestMeasurement && (
                        <>
                          {latestMeasurement.deliveryDate && (
                            <p className="text-sm text-primary">
                              {new Date(latestMeasurement.deliveryDate).toLocaleDateString('ar-SA')}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            ({getStatusText(latestMeasurement.status)})
                          </p>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {latestMeasurement?.status === 'delivered' && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                      <button 
                        className="p-1 text-primary"
                        onClick={() => openInvoiceDialog(client, 'client')}
                      >
                        <Printer className="w-5 h-5" />
                      </button>
                      <button className="p-1 text-primary">
                        <Mail className="w-5 h-5" />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1">
                            <MoreVertical className="w-5 h-5 text-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          <DropdownMenuItem onClick={() => onEditClient(client.id)}>
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openStatusDialog(client)}>
                            نقل حالة العمل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openInvoiceDialog(client, 'client')}>
                            طباعة الفاتورة للعميل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openInvoiceDialog(client, 'measurement')}>
                            طباعة فاتورة المقاسات
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openPaymentDialog(client)}>
                            توصيل المبلغ المتبقى
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDeliverDialog(client)}>
                            تسليم المقاس للعميل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={onAddClient}>
                            إضافة مقاس جديد للعميل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            عرض جميع المبالغ التي تم توصيلها
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            عرض جميع مقاسات العميل
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeleteDialog({ open: true, client })}
                            className="text-destructive"
                          >
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Add Client FAB */}
      <button
        onClick={onAddClient}
        className="fixed bottom-6 left-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
      >
        <UserPlus className="w-6 h-6 text-primary-foreground" />
      </button>

      {/* Status Dialog */}
      <Dialog open={statusDialog.open} onOpenChange={(open) => setStatusDialog({ ...statusDialog, open })}>
        <DialogContent className="bg-popover">
          <DialogHeader>
            <DialogTitle>تحديث حالة مقاس العميل</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {(['new', 'in-progress', 'ready', 'delivered'] as const).map((status) => (
              <label key={status} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={selectedStatus === status}
                  onChange={() => setSelectedStatus(status)}
                  className="w-5 h-5 accent-primary"
                />
                <span>{getStatusText(status)}</span>
              </label>
            ))}
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setStatusDialog({ ...statusDialog, open: false })}>
              الغاء
            </Button>
            <Button onClick={handleStatusChange} className="bg-primary text-primary-foreground">
              نعم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deliver Dialog */}
      <Dialog open={deliverDialog.open} onOpenChange={(open) => setDeliverDialog({ ...deliverDialog, open })}>
        <DialogContent className="bg-popover">
          <DialogHeader>
            <DialogTitle>تسليم المقاس للعميل</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center mb-4">
              المبلغ المتبقي لدى {deliverDialog.client?.name} هو ({deliverDialog.remaining})
              <br />
              هل انت متأكد من تسليم العمل للعميل بدون توصيل باقي المبلغ؟
            </p>
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                onClick={() => setDeliverDialog({ ...deliverDialog, open: false })}
                className="flex-1"
              >
                الغاء
              </Button>
              <Button 
                onClick={() => handleDeliver(false)} 
                className="bg-primary text-primary-foreground flex-1"
              >
                نعم
              </Button>
            </div>
            {deliverDialog.remaining > 0 && (
              <Button 
                onClick={() => handleDeliver(true)}
                className="w-full border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground"
              >
                هل تريد توصيل المبلغ المتبقي مع تسليم العمل؟
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <DialogContent className="bg-popover">
          <DialogHeader>
            <DialogTitle>حذف العميل</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center">
              هل تريد حذف العميل {deleteDialog.client?.name}؟
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}>
              لا
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              نعم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog.open} onOpenChange={(open) => setPaymentDialog({ ...paymentDialog, open })}>
        <DialogContent className="bg-popover">
          <DialogHeader>
            <DialogTitle>توصيل المبلغ المتبقي</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium">اسم العميل: {paymentDialog.client?.name}</label>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">المبلغ المتبقي</label>
              <Input
                type="text"
                value={paymentDialog.amount}
                onChange={(e) => setPaymentDialog({ ...paymentDialog, amount: e.target.value })}
                className="w-full"
                inputMode="decimal"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setPaymentDialog({ open: false, client: null, amount: '' })}>
              إلغاء
            </Button>
            <Button onClick={handlePayment} className="bg-primary text-primary-foreground">
              توصيل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Dialog */}
      <Dialog open={invoiceDialog.open} onOpenChange={(open) => setInvoiceDialog({ ...invoiceDialog, open })}>
        <DialogContent className="bg-white max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                {invoiceDialog.type === 'client' ? 'فاتورة العميل' : 'فاتورة المقاسات'}
              </DialogTitle>
              <div className="flex gap-2">
                <Button onClick={handlePrint} size="sm" className="bg-primary text-primary-foreground">
                  <Printer className="w-4 h-4 ml-2" />
                  طباعة
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setInvoiceDialog({ ...invoiceDialog, open: false })}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            {invoiceDialog.client && invoiceDialog.measurement && (
              invoiceDialog.type === 'client' ? (
                <ClientInvoice 
                  ref={invoiceRef}
                  client={invoiceDialog.client}
                  measurement={invoiceDialog.measurement}
                  shopSettings={shopSettings}
                />
              ) : (
                <MeasurementInvoice 
                  ref={invoiceRef}
                  client={invoiceDialog.client}
                  measurement={invoiceDialog.measurement}
                  shopSettings={shopSettings}
                />
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
