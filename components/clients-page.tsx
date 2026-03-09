"use client"

import { useState } from 'react'
import { useApp, Client } from '@/lib/context'
import { 
  ArrowRight, 
  Search, 
  UserPlus,
  Printer,
  Mail,
  Check,
  MoreVertical,
  Users
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

interface ClientsPageProps {
  onBack: () => void
  onAddClient: () => void
  onEditClient: (clientId: string) => void
}

export function ClientsPage({ onBack, onAddClient, onEditClient }: ClientsPageProps) {
  const { clients, deleteClient, updateMeasurementStatus, addPayment } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
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

  const filteredClients = clients.filter(client => 
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

  const openStatusDialog = (client: Client) => {
    const measurement = client.measurements[0]
    if (measurement) {
      setSelectedStatus(measurement.status)
      setStatusDialog({ open: true, clientId: client.id, measurementId: measurement.id })
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

      {/* Content */}
      <main className="p-4">
        {filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Users className="w-20 h-20 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-2">لا توجد عملاء</p>
            <p className="text-muted-foreground text-sm">ابدأ بإضافة عميل جديد للبدء</p>
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
                      <button className="p-1 text-primary">
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
                          <DropdownMenuItem>
                            طباعة الفاتورة للعميل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
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
    </div>
  )
}
