"use client"

import React, { useState, useRef } from 'react'
import { useApp, Client, Measurement } from '@/lib/context'
import { getMeasurementLabel, getDetailLabel } from '@/lib/measurements-labels'
import { downloadPDF } from '@/lib/pdf-utils' 
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
  onAddMeasurementForClient: (clientId: string) => void
  onEditClient: (clientId: string) => void
}

export function ClientsPage({ onBack, onAddClient, onAddMeasurementForClient, onEditClient }: ClientsPageProps) {
  const { clients, deleteClient, deleteMeasurement, updateMeasurementStatus, addPayment, shopSettings } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [currentTab, setCurrentTab] = useState<'new' | 'in-progress' | 'ready' | 'delivered'>('new')
  const [statusDialog, setStatusDialog] = useState<{ open: boolean; clientId: string; measurementId: string }>({ 
    open: false, 
    clientId: '', 
    measurementId: '' 
  })
  const [deliverDialog, setDeliverDialog] = useState<{ open: boolean; client: Client | null; remaining: number; measurementId: string }>({ 
    open: false, 
    client: null, 
    remaining: 0,
    measurementId: ''
  })
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; client: Client | null; measurementId: string }>({ 
    open: false, 
    client: null,
    measurementId: ''
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
  const [allMeasurementsDialog, setAllMeasurementsDialog] = useState<{ open: boolean; client: Client | null }>({
    open: false,
    client: null
  })
  const [allPaymentsDialog, setAllPaymentsDialog] = useState<{ open: boolean; client: Client | null }>({
    open: false,
    client: null
  })
  const invoiceRef = useRef<HTMLDivElement>(null)

  // Build a flat list of { client, measurement } entries — one per measurement matching the current tab
  const tabEntries: { client: Client; measurement: Measurement }[] = []
  for (const client of clients) {
    for (const measurement of client.measurements) {
      if (measurement.status === currentTab) {
        tabEntries.push({ client, measurement })
      }
    }
  }

  const filteredEntries = tabEntries.filter(({ client }) =>
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
    if (deliverDialog.client && deliverDialog.measurementId) {
      const client = deliverDialog.client
      if (withPayment && deliverDialog.remaining > 0) {
        addPayment(client.id, deliverDialog.remaining)
      }
      updateMeasurementStatus(client.id, deliverDialog.measurementId, 'delivered')
      setDeliverDialog({ open: false, client: null, remaining: 0, measurementId: '' })
    }
  }

  const handleDeleteMeasurement = () => {
    if (deleteDialog.client && deleteDialog.measurementId) {
      deleteMeasurement(deleteDialog.client.id, deleteDialog.measurementId)
      setDeleteDialog({ open: false, client: null, measurementId: '' })
    }
  }

  const handleDeleteClient = () => {
    if (deleteDialog.client) {
      deleteClient(deleteDialog.client.id)
      setDeleteDialog({ open: false, client: null, measurementId: '' })
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
      <div className="flex gap-2 px-3 py-3 border-b border-border bg-card overflow-x-auto">
        {([
          { key: 'new',         label: 'جديدة' },
          { key: 'in-progress', label: 'تحت العمل' },
          { key: 'ready',       label: 'جاهزة' },
          { key: 'delivered',   label: 'مسلمة' },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setCurrentTab(tab.key)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors flex-shrink-0 ${
              currentTab === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="p-4">
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Users className="w-20 h-20 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-2">
              {currentTab === 'new' ? 'لا توجد مقاسات جديدة'
                : currentTab === 'in-progress' ? 'لا توجد مقاسات تحت العمل'
                : currentTab === 'ready' ? 'لا توجد مقاسات جاهزة'
                : 'لا توجد مقاسات مسلمة'}
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
            {filteredEntries.map(({ client, measurement }) => {
              // index of this measurement within the client's list
              const mIndex = client.measurements.findIndex(m => m.id === measurement.id)
              const measurementLabel = client.measurements.length > 1 ? ` — طلب ${mIndex + 1}` : ''
              return (
                <div 
                  key={`${client.id}-${measurement.id}`}
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
                      <h3 className="font-bold text-foreground">{client.name}{measurementLabel}</h3>
                      {measurement.deliveryDate && (
                        <p className="text-sm text-primary">
                          {new Date(measurement.deliveryDate).toLocaleDateString('ar-SA')}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        ({getStatusText(measurement.status)})
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {measurement.status === 'delivered' && (
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
                          <DropdownMenuItem onClick={() => {
                            setSelectedStatus(measurement.status)
                            setStatusDialog({ open: true, clientId: client.id, measurementId: measurement.id })
                          }}>
                            نقل حالة العمل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openInvoiceDialog(client, 'client')}>
                            طباعة الفاتورة للعميل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openInvoiceDialog(client, 'measurement')}>
                            طباعة فاتورة المقاسات
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setPaymentDialog({ open: true, client, amount: measurement.remaining?.toString() ?? '0' })
                          }}>
                            توصيل المبلغ المتبقى
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setDeliverDialog({ open: true, client, remaining: measurement.remaining ?? 0 })
                          }}>
                            تسليم المقاس للعميل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onAddMeasurementForClient(client.id)}>
                            إضافة مقاس جديد للعميل
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setAllPaymentsDialog({ open: true, client })}>
                            عرض جميع المبالغ التي تم توصيلها
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setAllMeasurementsDialog({ open: true, client })}>
                            عرض جميع مقاسات العميل
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeleteDialog({ open: true, client, measurementId: measurement.id })}
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
        <DialogContent className="bg-popover" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>خيارات الحذف</DialogTitle>
          </DialogHeader>
          <div className="py-3 space-y-2">
            <p className="text-sm text-muted-foreground text-center mb-4">
              ماذا تريد حذف للعميل <span className="font-bold text-foreground">{deleteDialog.client?.name}</span>؟
            </p>

            {/* حذف الطلب فقط — يظهر فقط إذا كان العميل لديه أكثر من طلب */}
            {(deleteDialog.client?.measurements?.length ?? 0) > 1 ? (
              <button
                onClick={handleDeleteMeasurement}
                className="w-full text-right border border-border rounded-lg p-3 hover:bg-secondary transition-colors"
              >
                <p className="font-medium text-sm">حذف هذا الطلب فقط</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  سيُحذف الطلب ويبقى العميل مع بقية طلباته
                </p>
              </button>
            ) : null}

            <button
              onClick={handleDeleteClient}
              className="w-full text-right border border-destructive/40 rounded-lg p-3 hover:bg-destructive/10 transition-colors"
            >
              <p className="font-medium text-sm text-destructive">حذف العميل بالكامل</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                سيُحذف العميل وجميع طلباته نهائياً
              </p>
            </button>
          </div>
          <DialogFooter>
            <Button variant="outline" className="w-full" onClick={() => setDeleteDialog({ ...deleteDialog, open: false })}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* All Measurements Dialog */}
      <Dialog open={allMeasurementsDialog.open} onOpenChange={(open) => setAllMeasurementsDialog({ ...allMeasurementsDialog, open })}>
        <DialogContent className="bg-popover max-h-[90vh] overflow-y-auto w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>مقاسات: {allMeasurementsDialog.client?.name}</DialogTitle>
          </DialogHeader>

          {/* Printable area */}
          <div id="print-measurements" className="space-y-4 py-2" dir="rtl">
            {/* Shop header (print only) */}
            <div className="hidden print:block text-center border-b pb-3 mb-3">
              <p className="font-bold text-lg">{shopSettings.name}</p>
              <p className="text-sm">{shopSettings.phone}</p>
              <p className="text-sm">{shopSettings.address}</p>
              <p className="font-bold mt-2">مقاسات العميل: {allMeasurementsDialog.client?.name}</p>
            </div>

            {allMeasurementsDialog.client?.measurements.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">لا توجد مقاسات</p>
            ) : (
              allMeasurementsDialog.client?.measurements.map((m, index) => (
                <div key={m.id} className="border border-border rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-secondary flex justify-between items-center px-3 py-2">
                    <span className="font-bold text-sm">مقاس {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {m.createdAt ? new Date(m.createdAt).toLocaleDateString('ar-SA') : ''}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        m.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        m.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                        m.status === 'ready' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{getStatusText(m.status)}</span>
                    </div>
                  </div>

                  <div className="p-3 space-y-3">
                    {/* نوع القماش والعدد */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-secondary/50 rounded p-2">
                        <span className="text-muted-foreground block text-xs mb-0.5">نوع القماش</span>
                        <span className="font-medium">{m.fabricType || '—'}</span>
                      </div>
                      <div className="bg-secondary/50 rounded p-2">
                        <span className="text-muted-foreground block text-xs mb-0.5">العدد</span>
                        <span className="font-medium">{m.quantity}</span>
                      </div>
                    </div>

                    {/* المقاسات */}
                    {m.measurements && Object.keys(m.measurements).length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-muted-foreground mb-1 border-b border-border pb-1">المقاسات</p>
                        <div className="grid grid-cols-3 gap-1">
                          {Object.entries(m.measurements).map(([key, val]) => val ? (
                            <div key={key} className="bg-secondary/40 rounded px-2 py-1 text-xs">
                              <span className="text-muted-foreground">{getMeasurementLabel(key)}: </span>
                              <span className="font-medium">{val}</span>
                            </div>
                          ) : null)}
                        </div>
                      </div>
                    )}

                    {/* تفاصيل الخياطة */}
                    {m.details && Object.keys(m.details).length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-muted-foreground mb-1 border-b border-border pb-1">تفاصيل الخياطة</p>
                        <div className="space-y-1">
                          {Object.entries(m.details).map(([key, vals]) =>
                            Array.isArray(vals) && vals.length > 0 ? (
                              <div key={key} className="flex flex-wrap gap-1">
                                <span className="text-xs text-muted-foreground">{getDetailLabel(key)}:</span>
                                {vals.map(v => (
                                  <span key={v} className="text-xs bg-primary/10 text-primary rounded px-1.5 py-0.5">{getDetailLabel(v)}</span>
                                ))}
                              </div>
                            ) : null
                          )}
                        </div>
                      </div>
                    )}

                    {/* ملاحظة */}
                    {m.notes && (
                      <div className="text-xs text-muted-foreground border-t border-border pt-2">
                        <span className="font-medium">ملاحظة: </span>{m.notes}
                      </div>
                    )}

                    {/* تاريخ التسليم */}
                    {m.deliveryDate && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">موعد التسليم: </span>
                        {new Date(m.deliveryDate).toLocaleDateString('ar-SA')}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter className="flex gap-2 flex-row-reverse">
            <Button
              onClick={() => downloadPDF('print-measurements', `مقاسات-${allMeasurementsDialog.client?.name || 'عميل'}`)}
              className="bg-primary text-primary-foreground"
            >
              تحميل PDF
            </Button>
            <Button variant="outline" onClick={() => setAllMeasurementsDialog({ open: false, client: null })}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* All Payments Dialog */}
      <Dialog open={allPaymentsDialog.open} onOpenChange={(open) => setAllPaymentsDialog({ ...allPaymentsDialog, open })}>
        <DialogContent className="bg-popover max-h-[90vh] overflow-y-auto w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>فاتورة المبالغ — {allPaymentsDialog.client?.name}</DialogTitle>
          </DialogHeader>

          {/* Printable invoice */}
          <div id="print-invoice" className="space-y-4 py-2" dir="rtl">
            {/* Shop header */}
            <div className="text-center border-b border-border pb-3">
              <p className="font-bold text-base">{shopSettings.name}</p>
              <p className="text-sm text-muted-foreground">{shopSettings.phone}</p>
              {shopSettings.address && <p className="text-xs text-muted-foreground">{shopSettings.address}</p>}
            </div>

            {/* Client info */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-secondary/50 rounded p-2">
                <span className="text-muted-foreground block text-xs mb-0.5">الاسم</span>
                <span className="font-medium">{allPaymentsDialog.client?.name}</span>
              </div>
              <div className="bg-secondary/50 rounded p-2">
                <span className="text-muted-foreground block text-xs mb-0.5">رقم الهاتف</span>
                <span className="font-medium">{allPaymentsDialog.client?.phone || '—'}</span>
              </div>
            </div>

            {/* All Orders with their details */}
            <div className="space-y-3">
              <p className="text-sm font-bold border-b border-border pb-1">تفاصيل الطلبات</p>
              {allPaymentsDialog.client?.measurements?.map((m, index) => (
                <div key={m.id} className="border border-border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">طلب {index + 1}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      m.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      m.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                      m.status === 'ready' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{getStatusText(m.status)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-secondary/30 rounded p-1.5">
                      <span className="text-muted-foreground">نوع القماش: </span>
                      <span className="font-medium">{m.fabricType || '—'}</span>
                    </div>
                    <div className="bg-secondary/30 rounded p-1.5">
                      <span className="text-muted-foreground">العدد: </span>
                      <span className="font-medium">{m.quantity}</span>
                    </div>
                    <div className="bg-secondary/30 rounded p-1.5">
                      <span className="text-muted-foreground">السعر: </span>
                      <span className="font-medium">{m.price}</span>
                    </div>
                    <div className="bg-secondary/30 rounded p-1.5">
                      <span className="text-muted-foreground">المدفوع: </span>
                      <span className="font-medium">{m.paid}</span>
                    </div>
                    <div className="bg-secondary/30 rounded p-1.5 col-span-2">
                      <span className="text-muted-foreground">المتبقي: </span>
                      <span className="font-bold text-destructive">{m.remaining}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payments list */}
            <div>
              <p className="text-sm font-bold border-b border-border pb-1 mb-2">المبالغ الموصّلة لجميع الطلبات</p>
              {(!allPaymentsDialog.client?.payments || allPaymentsDialog.client.payments.length === 0) ? (
                <p className="text-center text-muted-foreground py-3 text-sm">لا توجد مبالغ موصّلة</p>
              ) : (
                <div className="space-y-2">
                  {allPaymentsDialog.client.payments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between border border-border rounded-lg px-3 py-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(p.date).toLocaleDateString('ar-SA')}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">
                        {p.type === 'initial' ? 'دفعة أولى' : p.type === 'delivery' ? 'عند التسليم' : 'تعديل'}
                      </span>
                      <span className="text-sm font-semibold text-primary">
                        {p.amount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Grand Summary */}
            {allPaymentsDialog.client && (
              <div className="border-t-2 border-primary pt-3 space-y-2 bg-secondary/20 rounded-lg p-3">
                <p className="text-sm font-bold text-center mb-2">الملخص الإجمالي</p>
                <div className="flex justify-between text-sm">
                  <span>إجمالي أسعار جميع الطلبات</span>
                  <span className="font-bold">
                    {allPaymentsDialog.client.measurements?.reduce((s, m) => s + (m.price || 0), 0) || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>إجمالي المبالغ الموصّلة</span>
                  <span className="font-bold text-primary">
                    {allPaymentsDialog.client.payments?.reduce((s, p) => s + p.amount, 0) || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-destructive border-t border-border pt-2">
                  <span>إجمالي المتبقي على العميل</span>
                  <span>
                    {allPaymentsDialog.client.measurements?.reduce((s, m) => s + (m.remaining || 0), 0) || 0}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2 flex-row-reverse">
            <Button
              onClick={() => downloadPDF('print-invoice', `فاتورة-${allPaymentsDialog.client?.name || 'عميل'}`)}
              className="bg-primary text-primary-foreground"
            >
              تحميل الفاتورة
            </Button>
            <Button variant="outline" onClick={() => setAllPaymentsDialog({ open: false, client: null })}>
              إغلاق
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
