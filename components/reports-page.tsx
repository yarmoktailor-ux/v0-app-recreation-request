"use client"

import { useState } from 'react'
import { useApp } from '@/lib/context'
import { ArrowRight, FileText, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface ReportsPageProps {
  onBack: () => void
}

type ReportType = 'daily-sales' | 'daily-delivered' | 'daily-remaining' | 'all-sales' | 'all-delivered' | 'all-remaining' | 'pending-at-customers' | 'periodic-sales' | null

export function ReportsPage({ onBack }: ReportsPageProps) {
  const { clients } = useApp()
  const [selectedReport, setSelectedReport] = useState<ReportType>(null)
  const [printDialog, setPrintDialog] = useState(false)

  // Generate report data
  const getReportData = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const data = clients.flatMap(client => 
      client.measurements.map(m => ({
        invoiceNo: m.id.substring(0, 8),
        clientName: client.name,
        date: m.orderDate,
        amount: m.price,
        paid: m.paid,
        remaining: m.price - m.paid,
        status: m.status
      }))
    )

    switch (selectedReport) {
      case 'daily-sales':
        return data.filter(item => {
          const itemDate = new Date(item.date)
          itemDate.setHours(0, 0, 0, 0)
          return itemDate.getTime() === today.getTime()
        })
      case 'daily-delivered':
        return data.filter(item => {
          const itemDate = new Date(item.date)
          itemDate.setHours(0, 0, 0, 0)
          return itemDate.getTime() === today.getTime() && item.status === 'delivered'
        })
      case 'daily-remaining':
        return data.filter(item => {
          const itemDate = new Date(item.date)
          itemDate.setHours(0, 0, 0, 0)
          return itemDate.getTime() === today.getTime() && item.remaining > 0
        })
      case 'all-sales':
        return data
      case 'all-delivered':
        return data.filter(item => item.status === 'delivered')
      case 'all-remaining':
        return data.filter(item => item.remaining > 0)
      case 'pending-at-customers':
        return data.filter(item => item.status !== 'delivered')
      case 'periodic-sales':
        return data
      default:
        return []
    }
  }

  const reportData = getReportData()
  const totalAmount = reportData.reduce((sum, item) => sum + item.amount, 0)
  const totalPaid = reportData.reduce((sum, item) => sum + item.paid, 0)
  const totalRemaining = reportData.reduce((sum, item) => sum + item.remaining, 0)

  const handlePrint = () => {
    const content = document.getElementById('report-table')
    if (content) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <title>تقرير</title>
            <meta charset="UTF-8">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Arial', sans-serif; padding: 20px; direction: rtl; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { padding: 12px; text-align: right; border: 1px solid #ddd; }
              th { background: #d4af37; font-weight: bold; color: #000; }
              .total { background: #d4af37; font-weight: bold; text-align: center; }
              .summary { margin-top: 20px; font-size: 18px; }
            </style>
          </head>
          <body>
            ${content.innerHTML}
            <div class="summary">
              <p>إجمالي المبلغ: ${totalAmount.toFixed(2)} ر.س</p>
              <p>المحصل: ${totalPaid.toFixed(2)} ر.س</p>
              <p>المتبقي: ${totalRemaining.toFixed(2)} ر.س</p>
            </div>
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

  if (!selectedReport) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-primary text-primary-foreground h-14 flex items-center px-4 gap-4">
          <button onClick={onBack}>
            <ArrowRight className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold">التقارير</h1>
        </header>

        <main className="p-4 space-y-3">
          <button 
            onClick={() => setSelectedReport('daily-sales')}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-center hover:opacity-90"
          >
            تقرير المبيعات اليومي
          </button>
          <button 
            onClick={() => setSelectedReport('daily-delivered')}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-center hover:opacity-90"
          >
            التقرير اليومي للمبالغ التي تم تسليمها
          </button>
          <button 
            onClick={() => setSelectedReport('daily-remaining')}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-center hover:opacity-90"
          >
            التقرير اليومي للمبالغ المتبقية عند العملاء
          </button>
          <button 
            onClick={() => setSelectedReport('all-sales')}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-center hover:opacity-90"
          >
            تقرير كل المبيعات
          </button>
          <button 
            onClick={() => setSelectedReport('all-delivered')}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-center hover:opacity-90"
          >
            تقرير كل المبالغ التي تم تسليمها
          </button>
          <button 
            onClick={() => setSelectedReport('all-remaining')}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-center hover:opacity-90"
          >
            تقرير كل المبالغ المتبقية عند العملاء
          </button>
          <button 
            onClick={() => setSelectedReport('pending-at-customers')}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-center hover:opacity-90"
          >
            المبالغ المتبقية عند العملاء (التي لم يتم تسليمهم العمل)
          </button>
          <button 
            onClick={() => setSelectedReport('periodic-sales')}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-center hover:opacity-90"
          >
            تقرير المبيعات (أسبوعي، شهري، سنوي)
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-primary text-primary-foreground h-14 flex items-center justify-between px-4 sticky top-0 z-10">
        <button onClick={() => setSelectedReport(null)}>
          <ArrowRight className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">إجمالي المبيعات</h1>
        <button onClick={() => setPrintDialog(true)} className="text-primary-foreground">
          <FileText className="w-6 h-6" />
        </button>
      </header>

      {/* Report Table */}
      <div id="report-table" className="p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-card border-b-2 border-primary">
              <th className="p-3 text-right">الرصيد</th>
              <th className="p-3 text-right">المبلغ</th>
              <th className="p-3 text-right">اسم العميل</th>
              <th className="p-3 text-right">رقم الفاتورة</th>
            </tr>
          </thead>
          <tbody>
            {reportData.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-muted-foreground">
                  لا توجد بيانات
                </td>
              </tr>
            ) : (
              reportData.map((item, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-card/50">
                  <td className="p-3 text-right">{item.remaining.toFixed(2)}</td>
                  <td className="p-3 text-right">{item.amount.toFixed(2)}</td>
                  <td className="p-3 text-right">{item.clientName}</td>
                  <td className="p-3 text-right">{item.invoiceNo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Total Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 text-center font-bold">
        الإجمالي {totalAmount.toFixed(2)}
      </div>

      {/* Print Dialog */}
      <Dialog open={printDialog} onOpenChange={setPrintDialog}>
        <DialogContent className="bg-popover" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>طباعة التقرير</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center mb-4">هل تريد طباعة هذا التقرير؟</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>إجمالي المبلغ: {totalAmount.toFixed(2)} ر.س</p>
              <p>المحصل: {totalPaid.toFixed(2)} ر.س</p>
              <p>المتبقي: {totalRemaining.toFixed(2)} ر.س</p>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setPrintDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handlePrint} className="bg-primary text-primary-foreground">
              <Printer className="w-4 h-4 ml-2" />
              طباعة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
