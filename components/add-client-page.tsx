"use client"

import { useState, useEffect } from 'react'
import { useApp } from '@/lib/context'
import { ArrowRight, Plus, ListPlus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KhaleejiMeasurements } from '@/components/khaleeji-measurements'

interface AddClientPageProps {
  onBack: () => void
  editingClientId?: string | null
}

type MeasurementType = 'thobe' | 'khaleeji' | 'suit'

export function AddClientPage({ onBack, editingClientId }: AddClientPageProps) {
  const { 
    addClient, 
    updateClient, 
    getClient, 
    addMeasurement,
    fabricTypes, 
    addFabricType,
    optionLists,
    addOptionToList
  } = useApp()

  const [activeTab, setActiveTab] = useState<MeasurementType>('khaleeji')
  const [showFabricDialog, setShowFabricDialog] = useState(false)
  const [showOptionDialog, setShowOptionDialog] = useState<{ open: boolean; listName: string; label: string }>({ 
    open: false, 
    listName: '', 
    label: '' 
  })
  const [newFabric, setNewFabric] = useState('')
  const [newOption, setNewOption] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    fabricType: '',
    quantity: 1,
    price: 0,
    paid: 0,
    tax: 0,
    discount: 0,
    discountType: 'percentage' as 'percentage' | 'amount',
    deliveryDate: new Date().toISOString().split('T')[0],
    notes: '',
    // Measurements
    tailoringType: [] as string[],
    measurements: {} as Record<string, string>,
    details: {} as Record<string, string[]>
  })

  // Load client data if editing
  useEffect(() => {
    if (editingClientId) {
      const client = getClient(editingClientId)
      if (client) {
        setFormData(prev => ({
          ...prev,
          name: client.name,
          phone: client.phone,
        }))
        if (client.measurements.length > 0) {
          const m = client.measurements[0]
          setFormData(prev => ({
            ...prev,
            fabricType: m.fabricType,
            quantity: m.quantity,
            price: m.price,
            paid: m.paid,
            tax: m.tax,
            discount: m.discount,
            discountType: m.discountType,
            deliveryDate: m.deliveryDate,
            notes: m.notes,
            measurements: m.measurements,
            details: m.details
          }))
          setActiveTab(m.type)
        }
      }
    }
  }, [editingClientId, getClient])

  // Calculate totals
  const subtotal = formData.price * formData.quantity
  const taxAmount = subtotal * (formData.tax / 100)
  const discountAmount = formData.discountType === 'percentage' 
    ? subtotal * (formData.discount / 100) 
    : formData.discount
  const total = subtotal + taxAmount - discountAmount
  const remaining = total - formData.paid

  const handleAddFabric = () => {
    if (newFabric.trim()) {
      addFabricType(newFabric.trim())
      setFormData(prev => ({ ...prev, fabricType: newFabric.trim() }))
      setNewFabric('')
      setShowFabricDialog(false)
    }
  }

  const handleAddOption = () => {
    if (newOption.trim() && showOptionDialog.listName) {
      addOptionToList(showOptionDialog.listName, newOption.trim())
      setNewOption('')
      setShowOptionDialog({ open: false, listName: '', label: '' })
    }
  }

  const handleMeasurementChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      measurements: { ...prev.measurements, [key]: value }
    }))
  }

  const handleDetailToggle = (category: string, value: string) => {
    setFormData(prev => {
      const current = prev.details[category] || []
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      return {
        ...prev,
        details: { ...prev.details, [category]: updated }
      }
    })
  }

  const handleTailoringTypeToggle = (type: string) => {
    setFormData(prev => {
      const current = prev.tailoringType
      const updated = current.includes(type)
        ? current.filter(t => t !== type)
        : [...current, type]
      return { ...prev, tailoringType: updated }
    })
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('الرجاء إدخال اسم العميل')
      return
    }

    const measurementData = {
      clientId: '',
      type: activeTab,
      fabricType: formData.fabricType,
      quantity: formData.quantity,
      price: formData.price,
      paid: formData.paid,
      remaining,
      tax: formData.tax,
      discount: formData.discount,
      discountType: formData.discountType,
      measurements: formData.measurements,
      details: formData.details,
      notes: formData.notes,
      deliveryDate: formData.deliveryDate,
      status: 'new' as const
    }

    if (editingClientId) {
      updateClient(editingClientId, {
        name: formData.name,
        phone: formData.phone
      })
      // Update or add measurement
      const client = getClient(editingClientId)
      if (client && client.measurements.length > 0) {
        // This would update existing measurement
      } else {
        addMeasurement(editingClientId, measurementData)
      }
    } else {
      const newClient = addClient({
        name: formData.name,
        phone: formData.phone,
        measurements: [{
          ...measurementData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        }]
      })
      measurementData.clientId = newClient.id
    }

    onBack()
  }

  // Render measurement input field
  const MeasurementField = ({ label, fieldKey }: { label: string; fieldKey: string }) => (
    <div className="bg-secondary rounded p-2">
      <label className="text-xs text-muted-foreground block mb-1">{label}</label>
      <Input
        type="text"
        value={formData.measurements[fieldKey] || ''}
        onChange={(e) => handleMeasurementChange(fieldKey, e.target.value)}
        className="h-8 bg-card border-0 text-center"
        inputMode="decimal"
      />
    </div>
  )

  // Render option selector with add button
  const OptionSelector = ({ 
    label, 
    listName, 
    value, 
    onChange 
  }: { 
    label: string
    listName: string
    value: string
    onChange: (value: string) => void
  }) => {
    const options = optionLists[listName] || []
    return (
      <div className="bg-secondary rounded p-2">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-primary">{label}</label>
          <button
            onClick={() => setShowOptionDialog({ open: true, listName, label })}
            className="text-primary"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="h-8 bg-card border-0">
            <SelectValue placeholder="اختر" />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground h-14 flex items-center justify-between px-4">
        <button onClick={onBack}>
          <ArrowRight className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">
          {editingClientId ? 'تعديل العميل' : 'اضافة عميل'}
        </h1>
        <button className="flex items-center gap-1 text-sm">
          <Plus className="w-4 h-4" />
          <span>صمم واجهتك</span>
        </button>
      </header>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as MeasurementType)} className="w-full">
        <TabsList className="w-full bg-secondary rounded-none h-12 p-0">
          <TabsTrigger 
            value="thobe" 
            className="flex-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none"
          >
            مقاسات الأثواب
          </TabsTrigger>
          <TabsTrigger 
            value="khaleeji" 
            className="flex-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none"
          >
            مقاسات الأثواب الخليجية
          </TabsTrigger>
          <TabsTrigger 
            value="suit" 
            className="flex-1 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none"
          >
            مقاسات البدلات
          </TabsTrigger>
          <button className="px-3 text-primary">
            <ListPlus className="w-5 h-5" />
          </button>
        </TabsList>

        {/* Common Fields */}
        <div className="p-4 space-y-4">
          {/* Client Name */}
          <div className="bg-card border border-border rounded-lg p-3 flex items-center gap-2">
            <span className="text-muted-foreground">👤</span>
            <Input
              placeholder="اسم العميل"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="border-0 bg-transparent text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
          </div>

          {/* Phone and Fabric */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-lg p-3 flex items-center gap-2">
              <span className="text-muted-foreground">📞</span>
              <Input
                placeholder="رقم الهاتف"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="border-0 bg-transparent"
              />
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-primary">نوع القماش</span>
                <button onClick={() => setShowFabricDialog(true)} className="text-primary">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Select 
                value={formData.fabricType} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, fabricType: v }))}
              >
                <SelectTrigger className="border-0 bg-transparent h-8 p-0">
                  <SelectValue placeholder="اختر نوع القماش" />
                </SelectTrigger>
                <SelectContent>
                  {fabricTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quantity and Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-lg p-3">
              <label className="text-xs text-muted-foreground block mb-1">الكمية</label>
              <Input
                type="text"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                className="border-0 bg-transparent h-8"
                inputMode="numeric"
              />
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <label className="text-xs text-muted-foreground block mb-1">تاريخ الاستلام</label>
              <Input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                className="border-0 bg-transparent h-8"
              />
            </div>
          </div>

          {/* Price Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-lg p-3">
              <label className="text-xs text-muted-foreground block mb-1">المبلغ</label>
              <Input
                type="text"
                value={formData.price || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                className="border-0 bg-transparent h-8"
                inputMode="decimal"
              />
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <label className="text-xs text-muted-foreground block mb-1">المدفوع</label>
              <Input
                type="text"
                value={formData.paid || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, paid: parseFloat(e.target.value) || 0 }))}
                className="border-0 bg-transparent h-8"
                inputMode="decimal"
              />
            </div>
          </div>

          {/* Tax and Discount */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-lg p-3">
              <label className="text-xs text-muted-foreground block mb-1">الضريبة المضافة (%)</label>
              <Input
                type="text"
                value={formData.tax || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                className="border-0 bg-transparent h-8"
                inputMode="decimal"
              />
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <label className="text-xs text-muted-foreground block mb-1">الخصم</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={formData.discount || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                  className="border-0 bg-transparent h-8 flex-1"
                  inputMode="decimal"
                />
                <Select 
                  value={formData.discountType} 
                  onValueChange={(v: 'percentage' | 'amount') => setFormData(prev => ({ ...prev, discountType: v }))}
                >
                  <SelectTrigger className="w-16 h-8 border-0 bg-secondary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">%</SelectItem>
                    <SelectItem value="amount">مبلغ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Remaining */}
          <div className="bg-card border border-border rounded-lg p-3">
            <label className="text-xs text-muted-foreground block mb-1">المتبقي</label>
            <div className="text-lg font-bold text-primary">{remaining.toFixed(2)}</div>
          </div>

          {/* Tab Content - Measurements */}
          <TabsContent value="khaleeji" className="mt-0">
            <KhaleejiMeasurements
              formData={{
                measurements: formData.measurements,
                details: formData.details,
                tailoringType: formData.tailoringType,
                notes: formData.notes,
                deliveryDate: formData.deliveryDate
              }}
              onMeasurementChange={handleMeasurementChange}
              onDetailToggle={handleDetailToggle}
              onTailoringTypeToggle={handleTailoringTypeToggle}
              onFormDataChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
            />
          </TabsContent>

          <TabsContent value="thobe" className="mt-0 space-y-4">
            {/* Basic Measurements for Thobe */}
            <div className="grid grid-cols-3 gap-2">
              <MeasurementField label="الطول" fieldKey="length" />
              <MeasurementField label="الكتف" fieldKey="shoulder" />
              <MeasurementField label="طول الكم" fieldKey="sleeve" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <MeasurementField label="وسع الصدر" fieldKey="chest" />
              <MeasurementField label="الرقبة" fieldKey="neck" />
              <MeasurementField label="وسع اليد" fieldKey="handWidth" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <MeasurementField label="طول الكبك" fieldKey="cuffLength" />
              <MeasurementField label="الخطوة" fieldKey="step" />
            </div>

            {/* Options */}
            <div className="grid grid-cols-3 gap-2">
              <OptionSelector 
                label="الرقبة" 
                listName="neckType" 
                value={formData.details['neckType']?.[0] || ''}
                onChange={(v) => setFormData(prev => ({ 
                  ...prev, 
                  details: { ...prev.details, neckType: [v] }
                }))}
              />
              <OptionSelector 
                label="الجبزور" 
                listName="jabzor" 
                value={formData.details['jabzor']?.[0] || ''}
                onChange={(v) => setFormData(prev => ({ 
                  ...prev, 
                  details: { ...prev.details, jabzor: [v] }
                }))}
              />
              <OptionSelector 
                label="اليد" 
                listName="hand" 
                value={formData.details['hand']?.[0] || ''}
                onChange={(v) => setFormData(prev => ({ 
                  ...prev, 
                  details: { ...prev.details, hand: [v] }
                }))}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <OptionSelector 
                label="الجيوب" 
                listName="pockets" 
                value={formData.details['pockets']?.[0] || ''}
                onChange={(v) => setFormData(prev => ({ 
                  ...prev, 
                  details: { ...prev.details, pockets: [v] }
                }))}
              />
              <OptionSelector 
                label="نوع التفصيل" 
                listName="tailoringType" 
                value={formData.details['tailoringTypeDetail']?.[0] || ''}
                onChange={(v) => setFormData(prev => ({ 
                  ...prev, 
                  details: { ...prev.details, tailoringTypeDetail: [v] }
                }))}
              />
              <OptionSelector 
                label="الزرار" 
                listName="button" 
                value={formData.details['button']?.[0] || ''}
                onChange={(v) => setFormData(prev => ({ 
                  ...prev, 
                  details: { ...prev.details, button: [v] }
                }))}
              />
            </div>

            {/* Notes */}
            <div className="bg-card border border-border rounded-lg p-3">
              <label className="text-xs text-muted-foreground block mb-1">ملاحظة</label>
              <Input
                placeholder="أضف ملاحظة..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="border-0 bg-transparent"
              />
            </div>

            {/* Delivery Date */}
            <div className="bg-card border border-border rounded-lg p-3">
              <label className="text-xs text-muted-foreground block mb-1">موعد التسليم</label>
              <Input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                className="border-0 bg-transparent"
              />
            </div>
          </TabsContent>

          <TabsContent value="suit" className="mt-0 space-y-4">
            {/* Shirt Measurements */}
            <div className="bg-card border border-border rounded-lg p-3">
              <label className="text-sm font-bold block mb-2 text-center bg-secondary rounded py-1">مقاسات القميص</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <MeasurementField label="الطول" fieldKey="shirtLength" />
                <MeasurementField label="الكتف" fieldKey="shirtShoulder" />
                <MeasurementField label="طول الكم" fieldKey="shirtSleeve" />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <MeasurementField label="وسع الصدر" fieldKey="shirtChest" />
                <MeasurementField label="الرقبة" fieldKey="shirtNeck" />
                <MeasurementField label="وسع اليد" fieldKey="shirtHand" />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <MeasurementField label="البطن" fieldKey="shirtBelly" />
              </div>
              <div className="mt-2">
                <Input
                  placeholder="ملاحظة"
                  value={formData.measurements['shirtNotes'] || ''}
                  onChange={(e) => handleMeasurementChange('shirtNotes', e.target.value)}
                  className="bg-secondary border-0"
                />
              </div>
            </div>

            {/* Pants Measurements */}
            <div className="bg-card border border-border rounded-lg p-3">
              <label className="text-sm font-bold block mb-2 text-center bg-secondary rounded py-1">مقاسات البنطلون</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <MeasurementField label="الطول" fieldKey="pantsLength" />
                <MeasurementField label="الحزام" fieldKey="pantsBelt" />
                <MeasurementField label="الورك" fieldKey="pantsHip" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <MeasurementField label="الفخذ" fieldKey="pantsThigh" />
                <MeasurementField label="الركبة" fieldKey="pantsKnee" />
                <MeasurementField label="الفتحة" fieldKey="pantsOpening" />
              </div>
              <div className="mt-2">
                <Input
                  placeholder="ملاحظة"
                  value={formData.measurements['pantsNotes'] || ''}
                  onChange={(e) => handleMeasurementChange('pantsNotes', e.target.value)}
                  className="bg-secondary border-0"
                />
              </div>
            </div>

            {/* Coat Measurements */}
            <div className="bg-card border border-border rounded-lg p-3">
              <label className="text-sm font-bold block mb-2 text-center bg-secondary rounded py-1">مقاسات الكوت</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <MeasurementField label="الطول" fieldKey="coatLength" />
                <MeasurementField label="الكتف" fieldKey="coatShoulder" />
                <MeasurementField label="طول اليد" fieldKey="coatArm" />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <MeasurementField label="وسع الصدر" fieldKey="coatChest" />
                <MeasurementField label="البطن" fieldKey="coatBelly" />
                <MeasurementField label="وسع اليد" fieldKey="coatHand" />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <MeasurementField label="وسط اليد" fieldKey="coatMiddleHand" />
              </div>
              <div className="mt-2">
                <Input
                  placeholder="ملاحظة"
                  value={formData.measurements['coatNotes'] || ''}
                  onChange={(e) => handleMeasurementChange('coatNotes', e.target.value)}
                  className="bg-secondary border-0"
                />
              </div>
            </div>

            {/* Vest Measurements */}
            <div className="bg-card border border-border rounded-lg p-3">
              <label className="text-sm font-bold block mb-2 text-center bg-secondary rounded py-1">مقاسات اليلق</label>
              <div className="grid grid-cols-3 gap-2">
                <MeasurementField label="الطول" fieldKey="vestLength" />
                <MeasurementField label="الكتف" fieldKey="vestShoulder" />
                <MeasurementField label="العرض" fieldKey="vestWidth" />
              </div>
            </div>

            {/* Delivery Date */}
            <div className="bg-card border border-border rounded-lg p-3">
              <label className="text-xs text-muted-foreground block mb-1">موعد التسليم</label>
              <Input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                className="border-0 bg-transparent"
              />
            </div>
          </TabsContent>

          {/* Save Button */}
          <Button 
            onClick={handleSave}
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-lg"
          >
            حفظ قياسات العميل
          </Button>
        </div>
      </Tabs>

      {/* Add Fabric Dialog */}
      <Dialog open={showFabricDialog} onOpenChange={setShowFabricDialog}>
        <DialogContent className="bg-popover">
          <DialogHeader>
            <DialogTitle className="text-center bg-primary text-primary-foreground py-2 -mx-6 -mt-6 rounded-t-lg">
              اسم القائمة
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="نوع القماش واللون"
              value={newFabric}
              onChange={(e) => setNewFabric(e.target.value)}
              className="text-center"
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowFabricDialog(false)}
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              الغاء
            </Button>
            <Button 
              onClick={handleAddFabric}
              className="flex-1 bg-primary text-primary-foreground"
            >
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Option Dialog */}
      <Dialog open={showOptionDialog.open} onOpenChange={(open) => setShowOptionDialog({ ...showOptionDialog, open })}>
        <DialogContent className="bg-popover">
          <DialogHeader>
            <DialogTitle className="text-center bg-primary text-primary-foreground py-2 -mx-6 -mt-6 rounded-t-lg">
              إضافة {showOptionDialog.label}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder={`أدخل ${showOptionDialog.label}`}
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              className="text-center"
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowOptionDialog({ open: false, listName: '', label: '' })}
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              الغاء
            </Button>
            <Button 
              onClick={handleAddOption}
              className="flex-1 bg-primary text-primary-foreground"
            >
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
