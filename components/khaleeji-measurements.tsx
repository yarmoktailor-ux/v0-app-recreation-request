"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Check, MessageSquare, Calendar } from 'lucide-react'

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
  onFormDataChange: (updates: Partial<typeof formData>) => void
}

// SVG Icons for neck types
const NeckSquare = () => (
  <svg viewBox="0 0 60 40" className="w-full h-full">
    <path d="M10 35 L10 15 Q10 5 20 5 L40 5 Q50 5 50 15 L50 35" 
          fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 5 L20 20 L40 20 L40 5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const NeckRound = () => (
  <svg viewBox="0 0 60 40" className="w-full h-full">
    <path d="M10 35 L10 15 Q10 5 20 5 L40 5 Q50 5 50 15 L50 35" 
          fill="none" stroke="currentColor" strokeWidth="2"/>
    <ellipse cx="30" cy="12" rx="12" ry="8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,2"/>
  </svg>
)

const NeckHidden = () => (
  <svg viewBox="0 0 60 40" className="w-full h-full">
    <path d="M10 35 L10 15 Q10 5 20 5 L40 5 Q50 5 50 15 L50 35" 
          fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M22 5 Q30 18 38 5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

// SVG Icons for cuff types
const CuffNormal = () => (
  <svg viewBox="0 0 60 50" className="w-full h-full">
    <path d="M15 10 L15 40 L45 40 L45 10" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 10 L20 5 L30 0 L40 5 L40 10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="30" y1="15" x2="30" y2="25" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2"/>
  </svg>
)

const CuffFrench = () => (
  <svg viewBox="0 0 60 50" className="w-full h-full">
    <path d="M15 10 L15 40 L45 40 L45 10" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 10 L25 0 L35 0 L40 10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="25" y1="18" x2="25" y2="22" stroke="currentColor" strokeWidth="1"/>
    <line x1="35" y1="18" x2="35" y2="22" stroke="currentColor" strokeWidth="1"/>
  </svg>
)

const CuffRound = () => (
  <svg viewBox="0 0 60 50" className="w-full h-full">
    <path d="M15 10 L15 40 L45 40 L45 10" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 10 Q30 -5 40 10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

// Chinese collar styles
const ChineseSquare = () => (
  <svg viewBox="0 0 60 50" className="w-full h-full">
    <ellipse cx="30" cy="35" rx="25" ry="12" fill="none" stroke="currentColor" strokeWidth="2"/>
    <rect x="20" y="5" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const ChineseRound = () => (
  <svg viewBox="0 0 60 50" className="w-full h-full">
    <ellipse cx="30" cy="35" rx="25" ry="12" fill="none" stroke="currentColor" strokeWidth="2"/>
    <ellipse cx="30" cy="15" rx="10" ry="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const ChineseGradient = () => (
  <svg viewBox="0 0 60 50" className="w-full h-full">
    <ellipse cx="30" cy="35" rx="25" ry="12" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 25 Q30 5 40 25" fill="none" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

// Pocket types
const PocketSquare = () => (
  <svg viewBox="0 0 40 50" className="w-full h-full">
    <rect x="5" y="5" width="30" height="40" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const PocketNormal = () => (
  <svg viewBox="0 0 40 50" className="w-full h-full">
    <rect x="5" y="5" width="30" height="40" fill="none" stroke="currentColor" strokeWidth="2"/>
    <line x1="5" y1="20" x2="35" y2="20" stroke="currentColor" strokeWidth="1"/>
  </svg>
)

const PocketDiagonal = () => (
  <svg viewBox="0 0 40 50" className="w-full h-full">
    <rect x="5" y="5" width="30" height="40" fill="none" stroke="currentColor" strokeWidth="2"/>
    <line x1="5" y1="25" x2="35" y2="15" stroke="currentColor" strokeWidth="1"/>
  </svg>
)

const PocketManager = () => (
  <svg viewBox="0 0 40 50" className="w-full h-full">
    <rect x="5" y="5" width="30" height="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4,2"/>
  </svg>
)

// Jabzor patterns
const JabzorPattern = ({ pattern }: { pattern: number }) => (
  <svg viewBox="0 0 50 60" className="w-full h-full">
    <rect x="5" y="5" width="40" height="50" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    {pattern === 1 && (
      <>
        <circle cx="15" cy="15" r="2" fill="currentColor"/>
        <circle cx="35" cy="15" r="2" fill="currentColor"/>
        <circle cx="15" cy="30" r="2" fill="currentColor"/>
        <circle cx="35" cy="30" r="2" fill="currentColor"/>
        <circle cx="15" cy="45" r="2" fill="currentColor"/>
        <circle cx="35" cy="45" r="2" fill="currentColor"/>
      </>
    )}
    {pattern === 2 && (
      <>
        <circle cx="15" cy="20" r="2" fill="currentColor"/>
        <circle cx="35" cy="20" r="2" fill="currentColor"/>
        <circle cx="15" cy="40" r="2" fill="currentColor"/>
        <circle cx="35" cy="40" r="2" fill="currentColor"/>
      </>
    )}
    {pattern === 3 && (
      <>
        <circle cx="25" cy="15" r="2" fill="currentColor"/>
        <circle cx="25" cy="30" r="2" fill="currentColor"/>
        <circle cx="25" cy="45" r="2" fill="currentColor"/>
      </>
    )}
    {pattern === 4 && (
      <>
        <circle cx="15" cy="15" r="2" fill="currentColor"/>
        <circle cx="25" cy="15" r="2" fill="currentColor"/>
        <circle cx="35" cy="15" r="2" fill="currentColor"/>
        <circle cx="15" cy="45" r="2" fill="currentColor"/>
        <circle cx="25" cy="45" r="2" fill="currentColor"/>
        <circle cx="35" cy="45" r="2" fill="currentColor"/>
      </>
    )}
    {pattern === 5 && (
      <>
        <circle cx="15" cy="20" r="2" fill="currentColor"/>
        <circle cx="25" cy="20" r="2" fill="currentColor"/>
        <circle cx="35" cy="20" r="2" fill="currentColor"/>
        <circle cx="15" cy="40" r="2" fill="currentColor"/>
        <circle cx="25" cy="40" r="2" fill="currentColor"/>
        <circle cx="35" cy="40" r="2" fill="currentColor"/>
      </>
    )}
  </svg>
)

// Cuff designs
const CuffDesign1 = () => (
  <svg viewBox="0 0 50 40" className="w-full h-full">
    <rect x="5" y="5" width="40" height="30" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="15" y1="5" x2="15" y2="35" stroke="currentColor" strokeWidth="1"/>
    <line x1="25" y1="5" x2="25" y2="35" stroke="currentColor" strokeWidth="1"/>
    <line x1="35" y1="5" x2="35" y2="35" stroke="currentColor" strokeWidth="1"/>
  </svg>
)

const CuffDesign2 = () => (
  <svg viewBox="0 0 50 40" className="w-full h-full">
    <rect x="5" y="5" width="40" height="30" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="25" cy="20" r="3" fill="currentColor"/>
  </svg>
)

const CuffDesign3 = () => (
  <svg viewBox="0 0 50 40" className="w-full h-full">
    <rect x="5" y="5" width="40" height="30" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="5" y1="20" x2="45" y2="20" stroke="currentColor" strokeWidth="1"/>
  </svg>
)

const CuffDesign4 = () => (
  <svg viewBox="0 0 50 40" className="w-full h-full">
    <path d="M5 35 L5 10 Q25 -5 45 10 L45 35" fill="none" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const CuffDesign5 = () => (
  <svg viewBox="0 0 50 40" className="w-full h-full">
    <path d="M5 35 L5 15 L15 5 L35 5 L45 15 L45 35" fill="none" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const CuffDesign6 = () => (
  <svg viewBox="0 0 50 40" className="w-full h-full">
    <rect x="5" y="5" width="40" height="30" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="5" y1="20" x2="20" y2="20" stroke="currentColor" strokeWidth="1"/>
    <line x1="30" y1="20" x2="45" y2="20" stroke="currentColor" strokeWidth="1"/>
  </svg>
)

// Selectable item with checkbox
interface SelectableItemProps {
  label: string
  icon: React.ReactNode
  selected: boolean
  onSelect: () => void
  inputValue?: string
  onInputChange?: (value: string) => void
  showInput?: boolean
}

const SelectableItem = ({ 
  label, 
  icon, 
  selected, 
  onSelect, 
  inputValue, 
  onInputChange,
  showInput = true 
}: SelectableItemProps) => (
  <div className="flex flex-col items-center">
    <div 
      className={`relative w-16 h-14 border-2 rounded cursor-pointer flex items-center justify-center transition-colors ${
        selected ? 'border-primary bg-primary/10' : 'border-border bg-card'
      }`}
      onClick={onSelect}
    >
      {selected && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      )}
      <div className="w-10 h-10 text-foreground">
        {icon}
      </div>
    </div>
    <span className="text-xs mt-1 text-center">{label}</span>
    {showInput && (
      <Input
        type="text"
        value={inputValue || ''}
        onChange={(e) => onInputChange?.(e.target.value)}
        className="w-14 h-6 mt-1 text-center text-xs border border-border"
        inputMode="numeric"
      />
    )}
  </div>
)

// Checkbox item
interface CheckboxItemProps {
  label: string
  checked: boolean
  onChange: () => void
}

const CheckboxItem = ({ label, checked, onChange }: CheckboxItemProps) => (
  <label className="flex items-center gap-2 cursor-pointer justify-end">
    <span className="text-sm">{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-5 h-5 accent-primary"
    />
  </label>
)

export function KhaleejiMeasurements({
  formData,
  onMeasurementChange,
  onDetailToggle,
  onTailoringTypeToggle,
  onFormDataChange
}: KhaleejiMeasurementsProps) {
  const isDetailSelected = (category: string, value: string) => {
    return formData.details[category]?.includes(value) || false
  }

  const toggleDetail = (category: string, value: string) => {
    onDetailToggle(category, value)
  }

  return (
    <div className="space-y-4 text-right" dir="rtl">
      {/* Tailoring Type */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="bg-secondary text-center py-2 rounded mb-3">
          <span className="font-bold">نوع التفصيل</span>
        </div>
        <div className="flex justify-around">
          {['سعودي', 'قطري', 'اماراتي', 'كويتي'].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm">{type}</span>
              <input
                type="checkbox"
                checked={formData.tailoringType.includes(type)}
                onChange={() => onTailoringTypeToggle(type)}
                className="w-5 h-5 accent-primary"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Basic Measurements Grid */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 gap-px bg-border">
          {/* طول الكم */}
          <div className="bg-card p-2">
            <div className="bg-secondary text-center text-xs py-1 rounded mb-1">طول الكم</div>
            <div className="grid grid-cols-2 gap-1">
              <div>
                <span className="text-xs text-muted-foreground block text-center">س</span>
                <Input
                  type="text"
                  value={formData.measurements['sleeveS'] || ''}
                  onChange={(e) => onMeasurementChange('sleeveS', e.target.value)}
                  className="h-7 text-center text-sm"
                  inputMode="decimal"
                />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block text-center">ك</span>
                <Input
                  type="text"
                  value={formData.measurements['sleeveK'] || ''}
                  onChange={(e) => onMeasurementChange('sleeveK', e.target.value)}
                  className="h-7 text-center text-sm"
                  inputMode="decimal"
                />
              </div>
            </div>
          </div>
          
          {/* الكتف */}
          <div className="bg-card p-2">
            <div className="bg-secondary text-center text-xs py-1 rounded mb-1">الكتف</div>
            <Input
              type="text"
              value={formData.measurements['shoulder'] || ''}
              onChange={(e) => onMeasurementChange('shoulder', e.target.value)}
              className="h-7 text-center text-sm"
              inputMode="decimal"
            />
          </div>
          
          {/* الطول */}
          <div className="bg-card p-2">
            <div className="bg-secondary text-center text-xs py-1 rounded mb-1">الطول</div>
            <Input
              type="text"
              value={formData.measurements['length'] || ''}
              onChange={(e) => onMeasurementChange('length', e.target.value)}
              className="h-7 text-center text-sm"
              inputMode="decimal"
            />
          </div>
        </div>
      </div>

      {/* وسع الصدر */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="bg-secondary text-center py-2">
          <span className="font-bold">وسع الصدر</span>
        </div>
        <div className="grid grid-cols-3 gap-px bg-border">
          <div className="bg-card p-2">
            <div className="text-center text-xs text-muted-foreground mb-1">HP</div>
            <Input
              type="text"
              value={formData.measurements['hp'] || ''}
              onChange={(e) => onMeasurementChange('hp', e.target.value)}
              className="h-8 text-center"
              inputMode="decimal"
            />
          </div>
          <div className="bg-card p-2">
            <div className="text-center text-xs text-muted-foreground mb-1">وسط</div>
            <Input
              type="text"
              value={formData.measurements['waist'] || ''}
              onChange={(e) => onMeasurementChange('waist', e.target.value)}
              className="h-8 text-center"
              inputMode="decimal"
            />
          </div>
          <div className="bg-card p-2">
            <div className="text-center text-xs text-muted-foreground mb-1">صدر</div>
            <Input
              type="text"
              value={formData.measurements['chest'] || ''}
              onChange={(e) => onMeasurementChange('chest', e.target.value)}
              className="h-8 text-center"
              inputMode="decimal"
            />
          </div>
        </div>
      </div>

      {/* Second row measurements */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 gap-px bg-border">
          {/* الكبك */}
          <div className="bg-card p-2">
            <div className="bg-secondary text-center text-xs py-1 rounded mb-1">الكبك</div>
            <div className="grid grid-cols-2 gap-1">
              <div>
                <span className="text-xs text-muted-foreground block text-center">س</span>
                <Input
                  type="text"
                  value={formData.measurements['cuffS'] || ''}
                  onChange={(e) => onMeasurementChange('cuffS', e.target.value)}
                  className="h-7 text-center text-sm"
                  inputMode="decimal"
                />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block text-center">ك</span>
                <Input
                  type="text"
                  value={formData.measurements['cuffK'] || ''}
                  onChange={(e) => onMeasurementChange('cuffK', e.target.value)}
                  className="h-7 text-center text-sm"
                  inputMode="decimal"
                />
              </div>
            </div>
          </div>
          
          {/* مودا */}
          <div className="bg-card p-2">
            <div className="text-center text-xs text-muted-foreground mb-1">مودا</div>
            <Input
              type="text"
              value={formData.measurements['moda'] || ''}
              onChange={(e) => onMeasurementChange('moda', e.target.value)}
              className="h-8 text-center"
              inputMode="decimal"
            />
          </div>
          
          {/* رقبة */}
          <div className="bg-card p-2">
            <div className="text-center text-xs text-muted-foreground mb-1">رقبة</div>
            <Input
              type="text"
              value={formData.measurements['neck'] || ''}
              onChange={(e) => onMeasurementChange('neck', e.target.value)}
              className="h-8 text-center"
              inputMode="decimal"
            />
          </div>
        </div>
      </div>

      {/* Third row measurements */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 gap-px bg-border">
          {/* مفصل */}
          <div className="bg-card p-2">
            <div className="bg-secondary text-center text-xs py-1 rounded mb-1">مفصل</div>
            <div className="grid grid-cols-2 gap-1">
              <div>
                <span className="text-xs text-muted-foreground block text-center">س</span>
                <Input
                  type="text"
                  value={formData.measurements['jointS'] || ''}
                  onChange={(e) => onMeasurementChange('jointS', e.target.value)}
                  className="h-7 text-center text-sm"
                  inputMode="decimal"
                />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block text-center">ك</span>
                <Input
                  type="text"
                  value={formData.measurements['jointK'] || ''}
                  onChange={(e) => onMeasurementChange('jointK', e.target.value)}
                  className="h-7 text-center text-sm"
                  inputMode="decimal"
                />
              </div>
            </div>
          </div>
          
          {/* وسع اسفل */}
          <div className="bg-card p-2">
            <div className="text-center text-xs text-muted-foreground mb-1">وسع اسفل</div>
            <Input
              type="text"
              value={formData.measurements['bottomWidth'] || ''}
              onChange={(e) => onMeasurementChange('bottomWidth', e.target.value)}
              className="h-8 text-center"
              inputMode="decimal"
            />
          </div>
          
          {/* كفة اسفل */}
          <div className="bg-card p-2">
            <div className="text-center text-xs text-muted-foreground mb-1">كفة اسفل</div>
            <Input
              type="text"
              value={formData.measurements['bottomCuff'] || ''}
              onChange={(e) => onMeasurementChange('bottomCuff', e.target.value)}
              className="h-8 text-center"
              inputMode="decimal"
            />
          </div>
        </div>
      </div>

      {/* Jabzor Section */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="grid grid-cols-2 gap-4">
          {/* Left side - checkboxes */}
          <div className="space-y-2">
            <CheckboxItem 
              label="سحاب مخفي" 
              checked={isDetailSelected('jabzor', 'سحاب مخفي')}
              onChange={() => toggleDetail('jabzor', 'سحاب مخفي')}
            />
            <CheckboxItem 
              label="سحاب باين" 
              checked={isDetailSelected('jabzor', 'سحاب باين')}
              onChange={() => toggleDetail('jabzor', 'سحاب باين')}
            />
          </div>
          
          {/* Right side - patterns */}
          <div className="flex gap-2 justify-end">
            {[1, 2, 3, 4, 5].map((pattern) => (
              <div 
                key={pattern}
                className={`w-12 h-14 border rounded cursor-pointer ${
                  isDetailSelected('jabzorPattern', `pattern${pattern}`) 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border'
                }`}
                onClick={() => toggleDetail('jabzorPattern', `pattern${pattern}`)}
              >
                <JabzorPattern pattern={pattern} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Notes for jabzor */}
        <div className="mt-3 flex items-center gap-2 border-t pt-3">
          <MessageSquare className="w-5 h-5 text-primary" />
          <Input
            placeholder="ملاحظة للجبزور"
            value={formData.measurements['jabzorNote'] || ''}
            onChange={(e) => onMeasurementChange('jabzorNote', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {/* Pocket Section */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="grid grid-cols-2 gap-4">
          {/* Left side - checkboxes */}
          <div className="space-y-2">
            <CheckboxItem 
              label="جيب مخفي" 
              checked={isDetailSelected('pocket', 'جيب مخفي')}
              onChange={() => toggleDetail('pocket', 'جيب مخفي')}
            />
            <CheckboxItem 
              label="جيب باين" 
              checked={isDetailSelected('pocket', 'جيب باين')}
              onChange={() => toggleDetail('pocket', 'جيب باين')}
            />
            <CheckboxItem 
              label="جيب جبزور" 
              checked={isDetailSelected('pocket', 'جيب جبزور')}
              onChange={() => toggleDetail('pocket', 'جيب جبزور')}
            />
            <CheckboxItem 
              label="جيب باين مخفي" 
              checked={isDetailSelected('pocket', 'جيب باين مخفي')}
              onChange={() => toggleDetail('pocket', 'جيب باين مخفي')}
            />
            
            {/* نزول جيب و قلم */}
            <div className="flex items-center gap-2 mt-2">
              <CheckboxItem 
                label="قلم" 
                checked={isDetailSelected('pocket', 'قلم')}
                onChange={() => toggleDetail('pocket', 'قلم')}
              />
              <Input
                placeholder="نزول جيب"
                value={formData.measurements['pocketDrop'] || ''}
                onChange={(e) => onMeasurementChange('pocketDrop', e.target.value)}
                className="w-20 h-7 text-center text-sm"
                inputMode="decimal"
              />
              <span className="text-sm">نزول جيب</span>
            </div>
          </div>
          
          {/* Right side - pocket types */}
          <div className="flex gap-2 justify-end">
            <SelectableItem
              label="مديري"
              icon={<PocketManager />}
              selected={isDetailSelected('pocketType', 'مديري')}
              onSelect={() => toggleDetail('pocketType', 'مديري')}
              inputValue={formData.measurements['pocketManager'] || ''}
              onInputChange={(v) => onMeasurementChange('pocketManager', v)}
            />
            <SelectableItem
              label="قطري"
              icon={<PocketDiagonal />}
              selected={isDetailSelected('pocketType', 'قطري')}
              onSelect={() => toggleDetail('pocketType', 'قطري')}
              inputValue={formData.measurements['pocketDiagonal'] || ''}
              onInputChange={(v) => onMeasurementChange('pocketDiagonal', v)}
            />
            <SelectableItem
              label="عادي"
              icon={<PocketNormal />}
              selected={isDetailSelected('pocketType', 'عادي')}
              onSelect={() => toggleDetail('pocketType', 'عادي')}
              inputValue={formData.measurements['pocketNormal'] || ''}
              onInputChange={(v) => onMeasurementChange('pocketNormal', v)}
            />
            <SelectableItem
              label="مربع"
              icon={<PocketSquare />}
              selected={isDetailSelected('pocketType', 'مربع')}
              onSelect={() => toggleDetail('pocketType', 'مربع')}
              inputValue={formData.measurements['pocketSquare'] || ''}
              onInputChange={(v) => onMeasurementChange('pocketSquare', v)}
            />
          </div>
        </div>
      </div>

      {/* Notes Section 1 */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <Input
              placeholder="ملاحظة"
              value={formData.measurements['note1'] || ''}
              onChange={(e) => onMeasurementChange('note1', e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="text-center text-muted-foreground">ملاحظة</div>
        </div>
      </div>

      {/* Neck Types Section */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="grid grid-cols-2 gap-4">
          {/* Left side - button options */}
          <div className="space-y-2">
            <CheckboxItem 
              label="1.ب صدف" 
              checked={isDetailSelected('buttonType', '1.ب صدف')}
              onChange={() => toggleDetail('buttonType', '1.ب صدف')}
            />
            <CheckboxItem 
              label="2.ب صدف" 
              checked={isDetailSelected('buttonType', '2.ب صدف')}
              onChange={() => toggleDetail('buttonType', '2.ب صدف')}
            />
            <CheckboxItem 
              label="1.ب مخفي B" 
              checked={isDetailSelected('buttonType', '1.ب مخفي B')}
              onChange={() => toggleDetail('buttonType', '1.ب مخفي B')}
            />
            <CheckboxItem 
              label="2.ب مخفي B" 
              checked={isDetailSelected('buttonType', '2.ب مخفي B')}
              onChange={() => toggleDetail('buttonType', '2.ب مخفي B')}
            />
            <CheckboxItem 
              label="1 زرار" 
              checked={isDetailSelected('buttonType', '1 زرار')}
              onChange={() => toggleDetail('buttonType', '1 زرار')}
            />
            <CheckboxItem 
              label="2 زرار" 
              checked={isDetailSelected('buttonType', '2 زرار')}
              onChange={() => toggleDetail('buttonType', '2 زرار')}
            />
            <CheckboxItem 
              label="1.تركيبة" 
              checked={isDetailSelected('buttonType', '1.تركيبة')}
              onChange={() => toggleDetail('buttonType', '1.تركيبة')}
            />
            <CheckboxItem 
              label="2.تركيبة" 
              checked={isDetailSelected('buttonType', '2.تركيبة')}
              onChange={() => toggleDetail('buttonType', '2.تركيبة')}
            />
            
            {/* نزول زرار */}
            <div className="flex items-center gap-2">
              <Input
                placeholder=""
                value={formData.measurements['buttonDrop'] || ''}
                onChange={(e) => onMeasurementChange('buttonDrop', e.target.value)}
                className="w-20 h-7 text-center text-sm"
                inputMode="decimal"
              />
              <span className="text-sm">نزول زرار</span>
            </div>
            
            <CheckboxItem 
              label="ب.1" 
              checked={isDetailSelected('buttonType', 'ب.1')}
              onChange={() => toggleDetail('buttonType', 'ب.1')}
            />
            <CheckboxItem 
              label="ب.2" 
              checked={isDetailSelected('buttonType', 'ب.2')}
              onChange={() => toggleDetail('buttonType', 'ب.2')}
            />
            <CheckboxItem 
              label="حديدة جيب" 
              checked={isDetailSelected('buttonType', 'حديدة جيب')}
              onChange={() => toggleDetail('buttonType', 'حديدة جيب')}
            />
          </div>
          
          {/* Right side - neck and cuff types */}
          <div className="space-y-4">
            {/* Neck types row 1 */}
            <div className="flex gap-2 justify-end">
              <SelectableItem
                label="مخفي"
                icon={<NeckHidden />}
                selected={isDetailSelected('neckType', 'مخفي')}
                onSelect={() => toggleDetail('neckType', 'مخفي')}
                inputValue={formData.measurements['neckHidden'] || ''}
                onInputChange={(v) => onMeasurementChange('neckHidden', v)}
              />
              <SelectableItem
                label="مدور"
                icon={<NeckRound />}
                selected={isDetailSelected('neckType', 'مدور')}
                onSelect={() => toggleDetail('neckType', 'مدور')}
                inputValue={formData.measurements['neckRound'] || ''}
                onInputChange={(v) => onMeasurementChange('neckRound', v)}
              />
              <SelectableItem
                label="مربع"
                icon={<NeckSquare />}
                selected={isDetailSelected('neckType', 'مربع')}
                onSelect={() => toggleDetail('neckType', 'مربع')}
                inputValue={formData.measurements['neckSquare'] || ''}
                onInputChange={(v) => onMeasurementChange('neckSquare', v)}
              />
            </div>
            
            {/* Cuff types row */}
            <div className="flex gap-2 justify-end">
              <SelectableItem
                label="مدور"
                icon={<CuffRound />}
                selected={isDetailSelected('cuffType', 'مدور')}
                onSelect={() => toggleDetail('cuffType', 'مدور')}
                inputValue={formData.measurements['cuffRound'] || ''}
                onInputChange={(v) => onMeasurementChange('cuffRound', v)}
              />
              <SelectableItem
                label="فرنسي"
                icon={<CuffFrench />}
                selected={isDetailSelected('cuffType', 'فرنسي')}
                onSelect={() => toggleDetail('cuffType', 'فرنسي')}
                inputValue={formData.measurements['cuffFrench'] || ''}
                onInputChange={(v) => onMeasurementChange('cuffFrench', v)}
              />
              <SelectableItem
                label="عادي"
                icon={<CuffNormal />}
                selected={isDetailSelected('cuffType', 'عادي')}
                onSelect={() => toggleDetail('cuffType', 'عادي')}
                inputValue={formData.measurements['cuffNormal'] || ''}
                onInputChange={(v) => onMeasurementChange('cuffNormal', v)}
              />
            </div>
            
            {/* Empty input boxes */}
            <div className="flex gap-2 justify-end">
              <Input className="w-14 h-8" inputMode="decimal" 
                value={formData.measurements['extraInput1'] || ''}
                onChange={(e) => onMeasurementChange('extraInput1', e.target.value)}
              />
              <Input className="w-14 h-8" inputMode="decimal"
                value={formData.measurements['extraInput2'] || ''}
                onChange={(e) => onMeasurementChange('extraInput2', e.target.value)}
              />
              <Input className="w-14 h-8" inputMode="decimal"
                value={formData.measurements['extraInput3'] || ''}
                onChange={(e) => onMeasurementChange('extraInput3', e.target.value)}
              />
            </div>
            
            {/* Chinese collar types */}
            <div className="flex gap-2 justify-end">
              <SelectableItem
                label="صيني مدرج"
                icon={<ChineseGradient />}
                selected={isDetailSelected('chineseType', 'صيني مدرج')}
                onSelect={() => toggleDetail('chineseType', 'صيني مدرج')}
                inputValue={formData.measurements['chineseGradient'] || ''}
                onInputChange={(v) => onMeasurementChange('chineseGradient', v)}
              />
              <SelectableItem
                label="صيني مدور"
                icon={<ChineseRound />}
                selected={isDetailSelected('chineseType', 'صيني مدور')}
                onSelect={() => toggleDetail('chineseType', 'صيني مدور')}
                inputValue={formData.measurements['chineseRound'] || ''}
                onInputChange={(v) => onMeasurementChange('chineseRound', v)}
              />
              <SelectableItem
                label="صيني مربع"
                icon={<ChineseSquare />}
                selected={isDetailSelected('chineseType', 'صيني مربع')}
                onSelect={() => toggleDetail('chineseType', 'صيني مربع')}
                inputValue={formData.measurements['chineseSquare'] || ''}
                onInputChange={(v) => onMeasurementChange('chineseSquare', v)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section 2 */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center text-muted-foreground">ملاحظة</div>
          <div className="text-center text-muted-foreground">ملاحظة</div>
        </div>
      </div>

      {/* Cuff Designs Section */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="grid grid-cols-2 gap-4">
          {/* Left side - cuff options */}
          <div className="space-y-2">
            <CheckboxItem 
              label="كبك مقلوب كسرات" 
              checked={isDetailSelected('cuffDesign', 'كبك مقلوب كسرات')}
              onChange={() => toggleDetail('cuffDesign', 'كبك مقلوب كسرات')}
            />
            <CheckboxItem 
              label="كبك مقلوب بدون كسرات" 
              checked={isDetailSelected('cuffDesign', 'كبك مقلوب بدون كسرات')}
              onChange={() => toggleDetail('cuffDesign', 'كبك مقلوب بدون كسرات')}
            />
            <CheckboxItem 
              label="كبك حشوة كسرات" 
              checked={isDetailSelected('cuffDesign', 'كبك حشوة كسرات')}
              onChange={() => toggleDetail('cuffDesign', 'كبك حشوة كسرات')}
            />
            <CheckboxItem 
              label="كبك حشوة بدون كسرات" 
              checked={isDetailSelected('cuffDesign', 'كبك حشوة بدون كسرات')}
              onChange={() => toggleDetail('cuffDesign', 'كبك حشوة بدون كسرات')}
            />
            <CheckboxItem 
              label="سادة كيك" 
              checked={isDetailSelected('cuffDesign', 'سادة كيك')}
              onChange={() => toggleDetail('cuffDesign', 'سادة كيك')}
            />
            <CheckboxItem 
              label="كم مشبك" 
              checked={isDetailSelected('cuffDesign', 'كم مشبك')}
              onChange={() => toggleDetail('cuffDesign', 'كم مشبك')}
            />
            <CheckboxItem 
              label="كبك قماش مخيط" 
              checked={isDetailSelected('cuffDesign', 'كبك قماش مخيط')}
              onChange={() => toggleDetail('cuffDesign', 'كبك قماش مخيط')}
            />
            <CheckboxItem 
              label="كم حشوة جبزور" 
              checked={isDetailSelected('cuffDesign', 'كم حشوة جبزور')}
              onChange={() => toggleDetail('cuffDesign', 'كم حشوة جبزور')}
            />
          </div>
          
          {/* Right side - cuff design visuals */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div 
                className={`h-10 border rounded cursor-pointer ${
                  isDetailSelected('cuffVisual', 'design1') ? 'border-primary bg-primary/10' : 'border-border'
                }`}
                onClick={() => toggleDetail('cuffVisual', 'design1')}
              >
                <CuffDesign1 />
              </div>
              <div 
                className={`h-10 border rounded cursor-pointer ${
                  isDetailSelected('cuffVisual', 'design2') ? 'border-primary bg-primary/10' : 'border-border'
                }`}
                onClick={() => toggleDetail('cuffVisual', 'design2')}
              >
                <CuffDesign2 />
              </div>
              <div 
                className={`h-10 border rounded cursor-pointer ${
                  isDetailSelected('cuffVisual', 'design3') ? 'border-primary bg-primary/10' : 'border-border'
                }`}
                onClick={() => toggleDetail('cuffVisual', 'design3')}
              >
                <CuffDesign3 />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div 
                className={`h-10 border rounded cursor-pointer ${
                  isDetailSelected('cuffVisual', 'design4') ? 'border-primary bg-primary/10' : 'border-border'
                }`}
                onClick={() => toggleDetail('cuffVisual', 'design4')}
              >
                <CuffDesign4 />
              </div>
              <div 
                className={`h-10 border rounded cursor-pointer ${
                  isDetailSelected('cuffVisual', 'design5') ? 'border-primary bg-primary/10' : 'border-border'
                }`}
                onClick={() => toggleDetail('cuffVisual', 'design5')}
              >
                <CuffDesign5 />
              </div>
              <div 
                className={`h-10 border rounded cursor-pointer ${
                  isDetailSelected('cuffVisual', 'design6') ? 'border-primary bg-primary/10' : 'border-border'
                }`}
                onClick={() => toggleDetail('cuffVisual', 'design6')}
              >
                <CuffDesign6 />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div 
                className={`h-10 border rounded cursor-pointer ${
                  isDetailSelected('cuffVisual', 'design7') ? 'border-primary bg-primary/10' : 'border-border'
                }`}
                onClick={() => toggleDetail('cuffVisual', 'design7')}
              >
                <CuffDesign1 />
              </div>
              <div 
                className={`h-10 border rounded cursor-pointer ${
                  isDetailSelected('cuffVisual', 'design8') ? 'border-primary bg-primary/10' : 'border-border'
                }`}
                onClick={() => toggleDetail('cuffVisual', 'design8')}
              >
                <CuffDesign2 />
              </div>
              <div 
                className={`h-10 border rounded cursor-pointer ${
                  isDetailSelected('cuffVisual', 'design9') ? 'border-primary bg-primary/10' : 'border-border'
                }`}
                onClick={() => toggleDetail('cuffVisual', 'design9')}
              >
                <CuffDesign3 />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section 3 */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <Input
            placeholder="ملاحظة"
            value={formData.measurements['generalNote'] || ''}
            onChange={(e) => onMeasurementChange('generalNote', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {/* Sewing Type */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="bg-secondary text-center py-2 rounded mb-3">
          <span className="font-bold">نوع الخياطة</span>
        </div>
        <div className="flex justify-around">
          <CheckboxItem 
            label="سوبر مان" 
            checked={isDetailSelected('sewingType', 'سوبر مان')}
            onChange={() => toggleDetail('sewingType', 'سوبر مان')}
          />
          <CheckboxItem 
            label="دبل جينز" 
            checked={isDetailSelected('sewingType', 'دبل جينز')}
            onChange={() => toggleDetail('sewingType', 'دبل جينز')}
          />
          <CheckboxItem 
            label="مبروم" 
            checked={isDetailSelected('sewingType', 'مبروم')}
            onChange={() => toggleDetail('sewingType', 'مبروم')}
          />
        </div>
      </div>

      {/* Final Notes */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <Input
            placeholder="ملاحظة"
            value={formData.notes}
            onChange={(e) => onFormDataChange({ notes: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>

      {/* Delivery Date */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="text-sm">موعد التسليم</span>
          <Input
            type="date"
            value={formData.deliveryDate}
            onChange={(e) => onFormDataChange({ deliveryDate: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
}
