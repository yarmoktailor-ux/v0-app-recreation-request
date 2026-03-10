"use client"

import { useApp } from '@/lib/context'
import { ArrowRight, Clock, CheckCircle, Truck, AlertTriangle } from 'lucide-react'

interface TrackingPageProps {
  onBack: () => void
}

export function TrackingPage({ onBack }: TrackingPageProps) {
  const { clients, newCount, inProgressCount, readyCount, deliveredCount } = useApp()

  // Get all measurements with their status
  const allMeasurements = clients.flatMap(client => 
    client.measurements.map(m => ({
      ...m,
      clientName: client.name,
      clientId: client.id
    }))
  )

  const newMeasurements = allMeasurements.filter(m => m.status === 'new')
  const inProgressMeasurements = allMeasurements.filter(m => m.status === 'in-progress')
  const readyMeasurements = allMeasurements.filter(m => m.status === 'ready')
  const deliveredMeasurements = allMeasurements.filter(m => m.status === 'delivered')

  const StatusCard = ({ 
    title, 
    count, 
    icon: Icon, 
    color, 
    items 
  }: { 
    title: string
    count: number
    icon: React.ElementType
    color: string
    items: typeof allMeasurements
  }) => (
    <div className="bg-card border border-border rounded-lg p-4 mb-4">
      <div className={`flex items-center gap-2 mb-3 ${color}`}>
        <Icon className="w-5 h-5" />
        <span className="font-bold">{title}</span>
        <span className="mr-auto bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
          {count}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="text-muted-foreground text-center py-2">لا توجد طلبات</p>
      ) : (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {items.slice(0, 5).map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 bg-secondary rounded">
              <span className="text-sm text-muted-foreground">{item.deliveryDate}</span>
              <span>{item.clientName}</span>
            </div>
          ))}
          {items.length > 5 && (
            <p className="text-center text-sm text-muted-foreground">
              +{items.length - 5} المزيد
            </p>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground h-14 flex items-center px-4 gap-4">
        <button onClick={onBack}>
          <ArrowRight className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">تتبع العمل</h1>
      </header>

      <main className="p-4">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-blue-500 text-white p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{newCount}</div>
            <div className="text-xs">جديد</div>
          </div>
          <div className="bg-yellow-500 text-white p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <div className="text-xs">قيد العمل</div>
          </div>
          <div className="bg-green-500 text-white p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{readyCount}</div>
            <div className="text-xs">جاهز</div>
          </div>
          <div className="bg-gray-500 text-white p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">{deliveredCount}</div>
            <div className="text-xs">مسلم</div>
          </div>
        </div>

        {/* Status Cards */}
        <StatusCard
          title="جديد"
          count={newCount}
          icon={AlertTriangle}
          color="text-blue-500"
          items={newMeasurements}
        />
        <StatusCard
          title="قيد العمل"
          count={inProgressCount}
          icon={Clock}
          color="text-yellow-500"
          items={inProgressMeasurements}
        />
        <StatusCard
          title="جاهز للتسليم"
          count={readyCount}
          icon={CheckCircle}
          color="text-green-500"
          items={readyMeasurements}
        />
        <StatusCard
          title="تم التسليم"
          count={deliveredCount}
          icon={Truck}
          color="text-gray-500"
          items={deliveredMeasurements}
        />
      </main>
    </div>
  )
}
