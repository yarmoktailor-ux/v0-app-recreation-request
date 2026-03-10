"use client"

import { useApp } from '@/lib/context'
import { ArrowRight, TrendingUp, Users, Package, DollarSign } from 'lucide-react'

interface ReportsPageProps {
  onBack: () => void
}

export function ReportsPage({ onBack }: ReportsPageProps) {
  const { clients, newCount, inProgressCount, readyCount, deliveredCount } = useApp()

  // Calculate statistics
  const totalClients = clients.length
  const totalMeasurements = clients.reduce((sum, c) => sum + c.measurements.length, 0)
  const totalRevenue = clients.reduce((sum, c) => 
    sum + c.measurements.reduce((mSum, m) => mSum + m.price, 0), 0
  )
  const totalPaid = clients.reduce((sum, c) => 
    sum + c.measurements.reduce((mSum, m) => mSum + m.paid, 0), 0
  )
  const totalRemaining = totalRevenue - totalPaid

  // Monthly stats
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const thisMonthMeasurements = clients.reduce((sum, c) => 
    sum + c.measurements.filter(m => {
      const date = new Date(m.orderDate)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }).length, 0
  )

  const ReportCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color 
  }: { 
    title: string
    value: string | number
    icon: React.ElementType
    color: string
  }) => (
    <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-right flex-1">
        <p className="text-muted-foreground text-sm">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground h-14 flex items-center px-4 gap-4">
        <button onClick={onBack}>
          <ArrowRight className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">التقارير</h1>
      </header>

      <main className="p-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <ReportCard
            title="إجمالي العملاء"
            value={totalClients}
            icon={Users}
            color="bg-blue-500"
          />
          <ReportCard
            title="إجمالي الطلبات"
            value={totalMeasurements}
            icon={Package}
            color="bg-green-500"
          />
          <ReportCard
            title="الإيرادات"
            value={`${totalRevenue.toFixed(0)} ر.س`}
            icon={TrendingUp}
            color="bg-primary"
          />
          <ReportCard
            title="المتبقي"
            value={`${totalRemaining.toFixed(0)} ر.س`}
            icon={DollarSign}
            color="bg-red-500"
          />
        </div>

        {/* Status Summary */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-bold mb-4 text-right">حالة الطلبات</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="bg-blue-500 text-white px-2 py-1 rounded">{newCount}</span>
              <span>جديد</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="bg-yellow-500 text-white px-2 py-1 rounded">{inProgressCount}</span>
              <span>قيد العمل</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="bg-green-500 text-white px-2 py-1 rounded">{readyCount}</span>
              <span>جاهز للتسليم</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="bg-gray-500 text-white px-2 py-1 rounded">{deliveredCount}</span>
              <span>تم التسليم</span>
            </div>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-bold mb-4 text-right">إحصائيات الشهر الحالي</h3>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">{thisMonthMeasurements}</p>
            <p className="text-muted-foreground">طلب هذا الشهر</p>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-bold mb-4 text-right">الملخص المالي</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-green-500">{totalRevenue.toFixed(2)} ر.س</span>
              <span>إجمالي المبيعات</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-500">{totalPaid.toFixed(2)} ر.س</span>
              <span>المحصل</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-red-500 font-bold">{totalRemaining.toFixed(2)} ر.س</span>
              <span className="font-bold">المتبقي</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
