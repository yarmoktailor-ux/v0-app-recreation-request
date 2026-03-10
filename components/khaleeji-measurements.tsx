"use client"

import { Input } from '@/components/ui/input'
import { Check } from 'lucide-react'

interface KhaleejiMeasurementsProps {
  formData: {
    measurements: Record<string, string>
    details: Record<string, string[]>
    tailoringType: string[]
    notes: string
    deliveryDate: string
  }
  onMeasurementChange: (key: string, value: string) => void
  onDetailToggle: (category: string, value: string) => void
  onTailoringTypeToggle: (type: string) => void
  onFormDataChange: (updates: Record<string, unknown>) => void
}

export function KhaleejiMeasurements({
  formData,
  onMeasurementChange,
  onDetailToggle,
  onFormDataChange,
}: KhaleejiMeasurementsProps) {
  const m = formData.measurements
  const has = (cat: string, val: string) => formData.details[cat]?.includes(val) ?? false
  const tog = (cat: string, val: string) => onDetailToggle(cat, val)

  return (
    <div className="space-y-3 p-2" dir="rtl">
      {/* نوع التفصيل */}
      <div className="border border-border rounded-lg p-3">
        <div className="bg-secondary text-center font-bold py-1 rounded mb-3 text-sm">نوع التفصيل</div>
        <div className="flex justify-around">
          {['سعودي', 'قطري', 'إماراتي', 'كويتي'].map(t => (
            <label key={t} className="flex items-center gap-1.5 cursor-pointer text-sm">
              <span>{t}</span>
              <input type="checkbox" checked={formData.tailoringType.includes(t)} onChange={() => onFormDataChange({ tailoringType: formData.tailoringType.includes(t) ? formData.tailoringType.filter(x => x !== t) : [...formData.tailoringType, t] })} className="w-5 h-5 accent-primary" />
            </label>
          ))}
        </div>
      </div>

      {/* المقاسات الأساسية */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-border">
          <div className="p-2">
            <div className="bg-secondary text-center text-xs py-1 rounded mb-2">طول الكم</div>
            <div className="grid grid-cols-2 gap-1">
              <div className="flex flex-col items-center"><span className="text-xs text-muted-foreground">س</span><Input value={m['sleeveS'] || ''} onChange={e => onMeasurementChange('sleeveS', e.target.value)} className="h-7 text-center text-xs" inputMode="decimal" /></div>
              <div className="flex flex-col items-center"><span className="text-xs text-muted-foreground">ك</span><Input value={m['sleeveK'] || ''} onChange={e => onMeasurementChange('sleeveK', e.target.value)} className="h-7 text-center text-xs" inputMode="decimal" /></div>
            </div>
          </div>
          <div className="p-2 flex flex-col items-center"><span className="text-xs text-muted-foreground mb-1">الكتف</span><Input value={m['shoulder'] || ''} onChange={e => onMeasurementChange('shoulder', e.target.value)} className="h-8 text-center text-sm w-16" inputMode="decimal" /></div>
          <div className="p-2 flex flex-col items-center"><span className="text-xs text-muted-foreground mb-1">الطول</span><Input value={m['length'] || ''} onChange={e => onMeasurementChange('length', e.target.value)} className="h-8 text-center text-sm w-16" inputMode="decimal" /></div>
        </div>
      </div>

      {/* وسع الصدر */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-secondary text-center text-sm font-bold py-1">وسع الصدر</div>
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-border p-2 gap-2">
          <div className="flex flex-col items-center"><span className="text-xs text-muted-foreground mb-1">HP</span><Input value={m['hp'] || ''} onChange={e => onMeasurementChange('hp', e.target.value)} className="h-8 text-center text-sm w-16" inputMode="decimal" /></div>
          <div className="flex flex-col items-center"><span className="text-xs text-muted-foreground mb-1">وسط</span><Input value={m['waist'] || ''} onChange={e => onMeasurementChange('waist', e.target.value)} className="h-8 text-center text-sm w-16" inputMode="decimal" /></div>
          <div className="flex flex-col items-center"><span className="text-xs text-muted-foreground mb-1">صدر</span><Input value={m['chest'] || ''} onChange={e => onMeasurementChange('chest', e.target.value)} className="h-8 text-center text-sm w-16" inputMode="decimal" /></div>
        </div>
      </div>

      {/* الرقبة / مودا / الكبك */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-border">
          <div className="p-2">
            <div className="bg-secondary text-center text-xs py-1 rounded mb-2">الكبك</div>
            <div className="grid grid-cols-2 gap-1">
              <div className="flex flex-col items-center"><span className="text-xs text-muted-foreground">س</span><Input value={m['cuffS'] || ''} onChange={e => onMeasurementChange('cuffS', e.target.value)} className="h-7 text-center text-xs" inputMode="decimal" /></div>
              <div className="flex flex-col items-center"><span className="text-xs text-muted-foreground">ك</span><Input value={m['cuffK'] || ''} onChange={e => onMeasurementChange('cuffK', e.target.value)} className="h-7 text-center text-xs" inputMode="decimal" /></div>
            </div>
          </div>
          <div className="p-2 flex flex-col items-center"><span className="text-xs text-muted-foreground mb-1">مودا</span><Input value={m['moda'] || ''} onChange={e => onMeasurementChange('moda', e.target.value)} className="h-8 text-center text-sm w-16" inputMode="decimal" /></div>
          <div className="p-2 flex flex-col items-center"><span className="text-xs text-muted-foreground mb-1">رقبة</span><Input value={m['neck'] || ''} onChange={e => onMeasurementChange('neck', e.target.value)} className="h-8 text-center text-sm w-16" inputMode="decimal" /></div>
        </div>
      </div>

      {/* وسع أسفل / كفة أسفل / مفصل */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-border">
          <div className="p-2">
            <div className="bg-secondary text-center text-xs py-1 rounded mb-2">مفصل</div>
            <div className="grid grid-cols-2 gap-1">
              <div className="flex flex-col items-center"><span className="text-xs text-muted-foreground">س</span><Input value={m['jointS'] || ''} onChange={e => onMeasurementChange('jointS', e.target.value)} className="h-7 text-center text-xs" inputMode="decimal" /></div>
              <div className="flex flex-col items-center"><span className="text-xs text-muted-foreground">ك</span><Input value={m['jointK'] || ''} onChange={e => onMeasurementChange('jointK', e.target.value)} className="h-7 text-center text-xs" inputMode="decimal" /></div>
            </div>
          </div>
          <div className="p-2 flex flex-col items-center"><span className="text-xs text-muted-foreground mb-1">كفة أسفل</span><Input value={m['bottomCuff'] || ''} onChange={e => onMeasurementChange('bottomCuff', e.target.value)} className="h-8 text-center text-sm w-16" inputMode="decimal" /></div>
          <div className="p-2 flex flex-col items-center"><span className="text-xs text-muted-foreground mb-1">وسع أسفل</span><Input value={m['bottomWidth'] || ''} onChange={e => onMeasurementChange('bottomWidth', e.target.value)} className="h-8 text-center text-sm w-16" inputMode="decimal" /></div>
        </div>
      </div>

      {/* ملاحظة عامة */}
      <div className="border border-border rounded-lg p-3">
        <label className="text-xs text-muted-foreground block mb-1">ملاحظة</label>
        <textarea value={formData.notes} onChange={e => onFormDataChange({ notes: e.target.value })} placeholder="ملاحظات إضافية..." className="w-full min-h-12 p-2 border border-border rounded text-sm" />
      </div>

      {/* موعد التسليم */}
      <div className="border border-border rounded-lg p-3">
        <label className="text-xs text-muted-foreground block mb-1">موعد التسليم</label>
        <Input type="date" value={formData.deliveryDate} onChange={e => onFormDataChange({ deliveryDate: e.target.value })} className="border-border" />
      </div>
    </div>
  )
}
