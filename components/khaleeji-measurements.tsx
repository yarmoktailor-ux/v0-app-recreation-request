"use client"

import { Input } from '@/components/ui/input'
import { Check, MessageSquare } from 'lucide-react'
import { Calendar } from 'lucide-react'

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

// ── SVG رسومات أنواع الرقبة ──────────────────────────────────────────────────

const NeckSquareSVG = () => (
  <svg viewBox="0 0 56 70" width="100%" height="100%" fill="none" stroke="currentColor">
    <path d="M6 65 L6 28 Q6 8 18 8 L38 8 Q50 8 50 28 L50 65" strokeWidth="2.5"/>
    <rect x="18" y="8" width="20" height="22" strokeWidth="1.5"/>
  </svg>
)

const NeckNormalSVG = () => (
  <svg viewBox="0 0 56 70" width="100%" height="100%" fill="none" stroke="currentColor">
    <path d="M6 65 L6 28 Q6 8 18 8 L38 8 Q50 8 50 28 L50 65" strokeWidth="2.5"/>
    <path d="M18 8 Q28 32 38 8" strokeWidth="1.5"/>
  </svg>
)

const NeckRoundSVG = () => (
  <svg viewBox="0 0 56 70" width="100%" height="100%" fill="none" stroke="currentColor">
    <path d="M6 65 L6 28 Q6 8 18 8 L38 8 Q50 8 50 28 L50 65" strokeWidth="2.5"/>
    <ellipse cx="28" cy="16" rx="12" ry="9" strokeWidth="1.5"/>
  </svg>
)

const NeckManagerSVG = () => (
  <svg viewBox="0 0 56 70" width="100%" height="100%" fill="none" stroke="currentColor">
    <path d="M6 65 L6 28 Q6 8 18 8 L38 8 Q50 8 50 28 L50 65" strokeWidth="2.5" strokeDasharray="4 2"/>
    <rect x="18" y="8" width="20" height="22" strokeWidth="1.5" strokeDasharray="4 2"/>
  </svg>
)

// ── SVG رسومات أنواع الكبك ───────────────────────────────────────────────────

const CuffSquareSVG = () => (
  <svg viewBox="0 0 56 52" width="100%" height="100%" fill="none" stroke="currentColor">
    <path d="M8 48 L8 18 Q8 4 20 4 L36 4 Q48 4 48 18 L48 48" strokeWidth="2.5"/>
    <rect x="16" y="3" width="24" height="16" strokeWidth="1.5"/>
  </svg>
)

const CuffHiddenSVG = () => (
  <svg viewBox="0 0 56 52" width="100%" height="100%" fill="none" stroke="currentColor">
    <path d="M8 48 L8 18 Q8 4 20 4 L36 4 Q48 4 48 18 L48 48" strokeWidth="2.5"/>
    <ellipse cx="28" cy="12" rx="12" ry="8" strokeWidth="1.5"/>
  </svg>
)

const CuffRoundSVG = () => (
  <svg viewBox="0 0 56 52" width="100%" height="100%" fill="none" stroke="currentColor">
    <path d="M8 48 L8 18 Q8 4 20 4 L36 4 Q48 4 48 18 L48 48" strokeWidth="2.5"/>
    <path d="M18 4 Q28 20 38 4" strokeWidth="1.5"/>
  </svg>
)

const CuffNormalSVG = () => (
  <svg viewBox="0 0 56 60" width="100%" height="100%" fill="none" stroke="currentColor">
    <path d="M10 55 L10 25 L18 6 L38 6 L46 25 L46 55" strokeWidth="2.5"/>
    <line x1="28" y1="10" x2="28" y2="22" strokeWidth="1" strokeDasharray="2 2"/>
    <line x1="22" y1="8" x2="22" y2="20" strokeWidth="1" strokeDasharray="2 2"/>
    <line x1="34" y1="8" x2="34" y2="20" strokeWidth="1" strokeDasharray="2 2"/>
  </svg>
)

const CuffFrenchSVG = () => (
  <svg viewBox="0 0 56 60" width="100%" height="100%" fill="none" stroke="currentColor">
    <path d="M10 55 L10 25 L18 6 L38 6 L46 25 L46 55" strokeWidth="2.5"/>
    <circle cx="22" cy="16" r="2.5" fill="currentColor"/>
    <circle cx="34" cy="16" r="2.5" fill="currentColor"/>
  </svg>
)

const CuffRound2SVG = () => (
  <svg viewBox="0 0 56 60" width="100%" height="100%" fill="none" stroke="currentColor">
    <path d="M10 55 L10 20 Q10 5 28 5 Q46 5 46 20 L46 55" strokeWidth="2.5"/>
    <circle cx="28" cy="14" r="3" fill="currentColor"/>
  </svg>
)

const ChineseSquareSVG = () => (
  <svg viewBox="0 0 56 56" width="100%" height="100%" fill="none" stroke="currentColor">
    <ellipse cx="28" cy="42" rx="22" ry="11" strokeWidth="2"/>
    <rect x="18" y="8" width="20" height="26" strokeWidth="1.5"/>
  </svg>
)

const ChineseRoundSVG = () => (
  <svg viewBox="0 0 56 56" width="100%" height="100%" fill="none" stroke="currentColor">
    <ellipse cx="28" cy="42" rx="22" ry="11" strokeWidth="2"/>
    <ellipse cx="28" cy="20" rx="10" ry="13" strokeWidth="1.5"/>
  </svg>
)

const ChineseGradientSVG = () => (
  <svg viewBox="0 0 56 56" width="100%" height="100%" fill="none" stroke="currentColor">
    <ellipse cx="28" cy="42" rx="22" ry="11" strokeWidth="2"/>
    <path d="M18 32 Q28 8 38 32" strokeWidth="1.5"/>
  </svg>
)

// ── SVG رسومات أنواع الجيب ───────────────────────────────────────────────────

const PocketSquareSVG = () => (
  <svg viewBox="0 0 44 56" width="100%" height="100%" fill="none" stroke="currentColor">
    <rect x="4" y="4" width="36" height="48" strokeWidth="2"/>
  </svg>
)

const PocketNormalSVG = () => (
  <svg viewBox="0 0 44 56" width="100%" height="100%" fill="none" stroke="currentColor">
    <rect x="4" y="4" width="36" height="48" strokeWidth="2"/>
    <path d="M4 22 Q22 36 40 22" strokeWidth="1.5"/>
  </svg>
)

const PocketDiagonalSVG = () => (
  <svg viewBox="0 0 44 56" width="100%" height="100%" fill="none" stroke="currentColor">
    <rect x="4" y="4" width="36" height="48" strokeWidth="2"/>
    <line x1="4" y1="28" x2="40" y2="16" strokeWidth="1.5"/>
  </svg>
)

const PocketManagerSVG = () => (
  <svg viewBox="0 0 44 56" width="100%" height="100%" fill="none" stroke="currentColor">
    <rect x="4" y="4" width="36" height="48" strokeWidth="2" strokeDasharray="5 3"/>
  </svg>
)

// ── SVG رسومات الجبزور ────────────────────────────────────────────────────────

const jabzorDots = [
  [1, [{ x: 20, y: 14 }, { x: 30, y: 14 }, { x: 20, y: 26 }, { x: 30, y: 26 }, { x: 20, y: 38 }, { x: 30, y: 38 }, { x: 20, y: 50 }, { x: 30, y: 50 }]],
  [2, [{ x: 20, y: 14 }, { x: 30, y: 14 }, { x: 20, y: 30 }, { x: 30, y: 30 }, { x: 20, y: 46 }, { x: 30, y: 46 }]],
  [3, [{ x: 25, y: 14 }, { x: 25, y: 28 }, { x: 25, y: 42 }]],
  [4, [{ x: 14, y: 14 }, { x: 22, y: 14 }, { x: 30, y: 14 }, { x: 14, y: 48 }, { x: 22, y: 48 }, { x: 30, y: 48 }]],
  [5, [{ x: 14, y: 20 }, { x: 22, y: 20 }, { x: 30, y: 20 }, { x: 14, y: 36 }, { x: 22, y: 36 }, { x: 30, y: 36 }]],
] as const

const JabzorSVG = ({ pattern }: { pattern: number }) => {
  const dots = jabzorDots.find(([p]) => p === pattern)?.[1] ?? []
  return (
    <svg viewBox="0 0 44 64" width="100%" height="100%" fill="none" stroke="currentColor">
      <rect x="4" y="4" width="36" height="56" strokeWidth="1.5"/>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="2.5" fill="currentColor" stroke="none"/>
      ))}
    </svg>
  )
}

// ── SVG رسومات تصميمات الكبك (cuff designs) ──────────────────────────────────

const CuffD1 = () => (
  <svg viewBox="0 0 50 38" width="100%" height="100%" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="44" height="32" strokeWidth="1.5"/>
    <line x1="15" y1="3" x2="15" y2="35" strokeWidth="1"/>
    <line x1="27" y1="3" x2="27" y2="35" strokeWidth="1"/>
    <line x1="39" y1="3" x2="39" y2="35" strokeWidth="1"/>
  </svg>
)

const CuffD2 = () => (
  <svg viewBox="0 0 50 38" width="100%" height="100%" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="44" height="32" strokeWidth="1.5"/>
    <circle cx="25" cy="19" r="4" fill="currentColor" stroke="none"/>
  </svg>
)

const CuffD3 = () => (
  <svg viewBox="0 0 50 38" width="100%" height="100%" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="44" height="32" strokeWidth="1.5"/>
    <line x1="3" y1="19" x2="47" y2="19" strokeWidth="1.5"/>
  </svg>
)

const CuffD4 = () => (
  <svg viewBox="0 0 50 42" width="100%" height="100%" fill="none" stroke="currentColor">
    <rect x="3" y="8" width="44" height="32" strokeWidth="1.5"/>
    <path d="M3 8 L12 3 L38 3 L47 8" strokeWidth="1.5"/>
  </svg>
)

const CuffD5 = () => (
  <svg viewBox="0 0 50 42" width="100%" height="100%" fill="none" stroke="currentColor">
    <rect x="3" y="8" width="44" height="32" strokeWidth="1.5"/>
    <path d="M3 8 Q25 -2 47 8" strokeWidth="1.5"/>
  </svg>
)

const CuffD6 = () => (
  <svg viewBox="0 0 50 42" width="100%" height="100%" fill="none" stroke="currentColor">
    <rect x="3" y="8" width="44" height="32" strokeWidth="1.5"/>
    <path d="M3 8 Q14 20 3 32" strokeWidth="1.5"/>
    <path d="M47 8 Q36 20 47 32" strokeWidth="1.5"/>
  </svg>
)

// ── مكون عنصر قابل للاختيار مع رسمة ─────────────────────────────────────────

interface SelectableProps {
  label: string
  svg: React.ReactNode
  selected: boolean
  onSelect: () => void
  inputKey?: string
  inputValue?: string
  onInputChange?: (v: string) => void
}

const Selectable = ({ label, svg, selected, onSelect, inputValue, onInputChange }: SelectableProps) => (
  <div className="flex flex-col items-center gap-1">
    <div
      onClick={onSelect}
      className={`relative w-14 h-14 rounded border-2 cursor-pointer flex items-center justify-center transition-all ${
        selected ? 'border-primary bg-primary/10' : 'border-border bg-background'
      }`}
    >
      {selected && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center z-10">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      <div className="w-10 h-10">{svg}</div>
    </div>
    <span className="text-xs text-center leading-tight">{label}</span>
    {onInputChange !== undefined && (
      <Input
        value={inputValue || ''}
        onChange={(e) => onInputChange(e.target.value)}
        className="h-6 w-14 text-center text-xs px-1"
        inputMode="numeric"
      />
    )}
  </div>
)

// ── مكون checkbox بسيط ────────────────────────────────────────────────────────

const CB = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
  <label className="flex items-center justify-end gap-2 cursor-pointer text-sm">
    <span>{label}</span>
    <input type="checkbox" checked={checked} onChange={onChange} className="w-5 h-5 accent-primary shrink-0" />
  </label>
)

// ── مكون حقل مقاس ────────────────────────────────────────────────────────────

const MF = ({
  label, fieldKey, measurements, onChange
}: {
  label: string; fieldKey: string; measurements: Record<string, string>; onChange: (k: string, v: string) => void
}) => (
  <div className="flex flex-col items-center">
    <span className="text-xs text-muted-foreground mb-1">{label}</span>
    <Input
      value={measurements[fieldKey] || ''}
      onChange={(e) => onChange(fieldKey, e.target.value)}
      className="h-8 text-center text-sm"
      inputMode="decimal"
    />
  </div>
)

// ── المكون الرئيسي ────────────────────────────────────────────────────────────

export function KhaleejiMeasurements({
  formData,
  onMeasurementChange,
  onDetailToggle,
  onTailoringTypeToggle,
  onFormDataChange,
}: KhaleejiMeasurementsProps) {
  const has = (cat: string, val: string) => formData.details[cat]?.includes(val) ?? false
  const tog = (cat: string, val: string) => onDetailToggle(cat, val)
  const m = formData.measurements

  return (
    <div className="space-y-3 p-2" dir="rtl">

      {/* ── نوع التفصيل ────────────────────────────────────── */}
      <div className="border border-border rounded-lg p-3">
        <div className="bg-secondary text-center font-bold py-1 rounded mb-3 text-sm">نوع التفصيل</div>
        <div className="flex justify-around">
          {['سعودي', 'قطري', 'اماراتي', 'كويتي'].map(t => (
            <label key={t} className="flex items-center gap-1.5 cursor-pointer text-sm">
              <span>{t}</span>
              <input type="checkbox" checked={formData.tailoringType.includes(t)} onChange={() => onTailoringTypeToggle(t)} className="w-5 h-5 accent-primary" />
            </label>
          ))}
        </div>
      </div>

      {/* ── المقاسات الأساسية ──────────────────────────────── */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-border">
          {/* طول الكم */}
          <div className="p-2">
            <div className="bg-secondary text-center text-xs py-1 rounded mb-2">طول الكم</div>
            <div className="grid grid-cols-2 gap-1">
              {[['sleeveS', 'س'], ['sleeveK', 'ك']].map(([k, lbl]) => (
                <div key={k} className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground">{lbl}</span>
                  <Input value={m[k] || ''} onChange={e => onMeasurementChange(k, e.target.value)} className="h-7 text-center text-xs" inputMode="decimal" />
                </div>
              ))}
            </div>
          </div>
          <div className="p-2"><MF label="الكتف" fieldKey="shoulder" measurements={m} onChange={onMeasurementChange} /></div>
          <div className="p-2"><MF label="الطول" fieldKey="length" measurements={m} onChange={onMeasurementChange} /></div>
        </div>
      </div>

      {/* ── وسع الصدر ──────────────────────────────────────── */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-secondary text-center text-sm font-bold py-1">وسع الصدر</div>
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-border p-2 gap-2">
          <MF label="HP" fieldKey="hp" measurements={m} onChange={onMeasurementChange} />
          <MF label="وسط" fieldKey="waist" measurements={m} onChange={onMeasurementChange} />
          <MF label="صدر" fieldKey="chest" measurements={m} onChange={onMeasurementChange} />
        </div>
      </div>

      {/* ── الرقبة / مودا / الكبك ──────────────────────────── */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-border">
          {/* الكبك */}
          <div className="p-2">
            <div className="bg-secondary text-center text-xs py-1 rounded mb-2">الكبك</div>
            <div className="grid grid-cols-2 gap-1">
              {[['cuffS', 'س'], ['cuffK', 'ك']].map(([k, lbl]) => (
                <div key={k} className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground">{lbl}</span>
                  <Input value={m[k] || ''} onChange={e => onMeasurementChange(k, e.target.value)} className="h-7 text-center text-xs" inputMode="decimal" />
                </div>
              ))}
            </div>
          </div>
          <div className="p-2"><MF label="مودا" fieldKey="moda" measurements={m} onChange={onMeasurementChange} /></div>
          <div className="p-2"><MF label="رقبة" fieldKey="neck" measurements={m} onChange={onMeasurementChange} /></div>
        </div>
      </div>

      {/* ── مفصل / وسع اسفل / كفة اسفل ────────────────────── */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-border">
          {/* مفصل */}
          <div className="p-2">
            <div className="bg-secondary text-center text-xs py-1 rounded mb-2">مفصل</div>
            <div className="grid grid-cols-2 gap-1">
              {[['jointS', 'س'], ['jointK', 'ك']].map(([k, lbl]) => (
                <div key={k} className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground">{lbl}</span>
                  <Input value={m[k] || ''} onChange={e => onMeasurementChange(k, e.target.value)} className="h-7 text-center text-xs" inputMode="decimal" />
                </div>
              ))}
            </div>
          </div>
          <div className="p-2"><MF label="وسع اسفل" fieldKey="bottomWidth" measurements={m} onChange={onMeasurementChange} /></div>
          <div className="p-2"><MF label="كفة اسفل" fieldKey="bottomCuff" measurements={m} onChange={onMeasurementChange} /></div>
        </div>
      </div>

      {/* ── الجبزور ────────────────────────────────────────── */}
      <div className="border border-border rounded-lg p-3">
        {/* رسومات الجبزور - 5 أنواع في صف واحد */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          {[1, 2, 3, 4, 5].map(p => (
            <Selectable
              key={p}
              label=""
              svg={<JabzorSVG pattern={p} />}
              selected={has('jabzorPattern', `p${p}`)}
              onSelect={() => tog('jabzorPattern', `p${p}`)}
            />
          ))}
        </div>
        {/* الخيارات */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
          <CB label="سحاب مخفي" checked={has('jabzor', 'سحاب مخفي')} onChange={() => tog('jabzor', 'سحاب مخفي')} />
          <CB label="سحاب باين" checked={has('jabzor', 'سحاب باين')} onChange={() => tog('jabzor', 'سحاب باين')} />
        </div>
        {/* ملاحظة */}
        <div className="flex items-center gap-2 border-t pt-2">
          <MessageSquare className="w-5 h-5 text-primary shrink-0" />
          <Input placeholder="ملاحظة للجبزور" value={m['jabzorNote'] || ''} onChange={e => onMeasurementChange('jabzorNote', e.target.value)} className="flex-1" />
        </div>
      </div>

      {/* ── قسم الجيوب ─────────────────────────────────────── */}
      <div className="border border-border rounded-lg p-3">
        {/* رسومات الجيوب - 4 أنواع في صف واحد من اليمين */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            { label: 'مديري', svg: <PocketManagerSVG />, key: 'مديري', mKey: 'pocketManager' },
            { label: 'قطري',  svg: <PocketDiagonalSVG />, key: 'قطري',  mKey: 'pocketDiagonal' },
            { label: 'عادي',  svg: <PocketNormalSVG />, key: 'عادي',  mKey: 'pocketNormal' },
            { label: 'مربع',  svg: <PocketSquareSVG />, key: 'مربع',  mKey: 'pocketSquare' },
          ].map(({ label, svg, key, mKey }) => (
            <Selectable
              key={key}
              label={label}
              svg={svg}
              selected={has('pocketType', key)}
              onSelect={() => tog('pocketType', key)}
              inputValue={m[mKey] || ''}
              onInputChange={v => onMeasurementChange(mKey, v)}
            />
          ))}
        </div>

        {/* الخيارات اليمين + نزول جيب / قلم */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
          <CB label="جيب مخفي"      checked={has('pocket','جيب مخفي')}      onChange={() => tog('pocket','جيب مخفي')} />
          <CB label="جيب باين"       checked={has('pocket','جيب باين')}       onChange={() => tog('pocket','جيب باين')} />
          <CB label="جيب جبزور"      checked={has('pocket','جيب جبزور')}      onChange={() => tog('pocket','جيب جبزور')} />
          <CB label="جيب باين مخفي"  checked={has('pocket','جيب باين مخفي')}  onChange={() => tog('pocket','جيب باين مخفي')} />
        </div>

        {/* صف: قلم | نزول جيب */}
        <div className="flex items-center gap-2 flex-row-reverse">
          <label className="flex items-center gap-1.5 cursor-pointer text-sm shrink-0">
            <span>قلم</span>
            <input type="checkbox" checked={has('pocket','قلم')} onChange={() => tog('pocket','قلم')} className="w-5 h-5 accent-primary" />
          </label>
          <Input
            value={m['pocketDrop'] || ''}
            onChange={e => onMeasurementChange('pocketDrop', e.target.value)}
            className="w-20 h-7 text-center text-sm"
            inputMode="decimal"
          />
          <span className="text-sm shrink-0">نزول جيب</span>
        </div>
      </div>

      {/* ── ملاحظة 1 ───────────────────────────────────────── */}
      <div className="border border-border rounded-lg p-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary shrink-0" />
            <Input placeholder="ملاحظة" value={m['note1'] || ''} onChange={e => onMeasurementChange('note1', e.target.value)} className="flex-1" />
          </div>
          <div className="flex items-center justify-end">
            <Input placeholder="ملاحظة" value={m['note2'] || ''} onChange={e => onMeasurementChange('note2', e.target.value)} className="flex-1" />
          </div>
        </div>
      </div>

      {/* ── قسم الرقبة والكبك ──────────────────────────────── */}
      <div className="border border-border rounded-lg p-3">
        {/* أنواع الرقبة - صف */}
        <div className="mb-2">
          <div className="text-xs font-bold mb-2 text-center bg-secondary py-1 rounded">أنواع الرقبة</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'مخفي', svg: <NeckHiddenSVG />, key: 'مخفي', mKey: 'neckHidden' },
              { label: 'مدور', svg: <NeckRoundSVG />, key: 'مدور', mKey: 'neckRound' },
              { label: 'مربع', svg: <NeckSquareSVG />, key: 'مربع', mKey: 'neckSquare' },
            ].map(({ label, svg, key, mKey }) => (
              <Selectable key={key} label={label} svg={svg} selected={has('neckType', key)} onSelect={() => tog('neckType', key)} inputValue={m[mKey] || ''} onInputChange={v => onMeasurementChange(mKey, v)} />
            ))}
          </div>
        </div>

        {/* نوع الكبك العلوي (مخفي مدور مربع) - رسومات رأسية */}
        <div className="mb-2">
          <div className="text-xs font-bold mb-2 text-center bg-secondary py-1 rounded">نوع الكبك العلوي</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'مخفي', svg: <CuffHiddenSVG />, key: 'كبك-مخفي', mKey: 'cuffHidden' },
              { label: 'مدور', svg: <CuffRoundSVG />, key: 'كبك-مدور', mKey: 'cuffRoundV' },
              { label: 'مربع', svg: <CuffSquareSVG />, key: 'كبك-مربع', mKey: 'cuffSquare' },
            ].map(({ label, svg, key, mKey }) => (
              <Selectable key={key} label={label} svg={svg} selected={has('cuffNeck', key)} onSelect={() => tog('cuffNeck', key)} inputValue={m[mKey] || ''} onInputChange={v => onMeasurementChange(mKey, v)} />
            ))}
          </div>
        </div>

        {/* نوع الكبك السفلي (عادي فرنسي مدور) */}
        <div className="mb-2">
          <div className="text-xs font-bold mb-2 text-center bg-secondary py-1 rounded">نوع الكبك</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'عادي',   svg: <CuffNormalSVG />,  key: 'كبك-عادي',   mKey: 'cuffNormal' },
              { label: 'فرنسي',  svg: <CuffFrenchSVG />,  key: 'كبك-فرنسي',  mKey: 'cuffFrench' },
              { label: 'مدور',   svg: <CuffRound2SVG />,  key: 'كبك-مدور2',  mKey: 'cuffRound2' },
            ].map(({ label, svg, key, mKey }) => (
              <Selectable key={key} label={label} svg={svg} selected={has('cuffType', key)} onSelect={() => tog('cuffType', key)} inputValue={m[mKey] || ''} onInputChange={v => onMeasurementChange(mKey, v)} />
            ))}
          </div>
        </div>

        {/* الصيني (مربع مدور مدرج) */}
        <div className="mb-2">
          <div className="text-xs font-bold mb-2 text-center bg-secondary py-1 rounded">الصيني</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'صيني مربع',  svg: <ChineseSquareSVG />,   key: 'صيني-مربع',  mKey: 'chineseSquare' },
              { label: 'صيني مدور',  svg: <ChineseRoundSVG />,    key: 'صيني-مدور',  mKey: 'chineseRound' },
              { label: 'صيني مدرج', svg: <ChineseGradientSVG />, key: 'صيني-مدرج', mKey: 'chineseGrad' },
            ].map(({ label, svg, key, mKey }) => (
              <Selectable key={key} label={label} svg={svg} selected={has('cuffChinese', key)} onSelect={() => tog('cuffChinese', key)} inputValue={m[mKey] || ''} onInputChange={v => onMeasurementChange(mKey, v)} />
            ))}
          </div>
        </div>

        {/* Checkboxes الكبك / الأزرار */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 border-t pt-3">
          {[
            ['buttonType','1.ب صدف'], ['buttonType','2.ب صدف'],
            ['buttonType','1.ب مخفي B'], ['buttonType','2.ب مخفي B'],
            ['buttonType','1 زرار'], ['buttonType','2 زرار'],
            ['buttonType','1.تركيبة'], ['buttonType','2.تركيبة'],
          ].map(([cat, val]) => (
            <CB key={val} label={val} checked={has(cat, val)} onChange={() => tog(cat, val)} />
          ))}
          {/* نزول زرار */}
          <div className="col-span-2 flex items-center gap-2 flex-row-reverse mt-1">
            <span className="text-sm shrink-0">نزول زرار</span>
            <Input value={m['buttonDrop'] || ''} onChange={e => onMeasurementChange('buttonDrop', e.target.value)} className="w-20 h-7 text-center text-sm" inputMode="decimal" />
          </div>
          {[
            ['buttonType','ب.1'], ['buttonType','ب.2'], ['buttonType','حديدة جيب'],
          ].map(([cat, val]) => (
            <CB key={val} label={val} checked={has(cat, val)} onChange={() => tog(cat, val)} />
          ))}
        </div>
      </div>

      {/* ── ملاحظة 2 ───────────────────────────────────────── */}
      <div className="border border-border rounded-lg p-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary shrink-0" />
            <Input placeholder="ملاحظة" value={m['note3'] || ''} onChange={e => onMeasurementChange('note3', e.target.value)} className="flex-1" />
          </div>
          <div className="flex items-center justify-end">
            <Input placeholder="ملاحظة" value={m['note4'] || ''} onChange={e => onMeasurementChange('note4', e.target.value)} className="flex-1" />
          </div>
        </div>
      </div>

      {/* ── قسم تصميم الكبك (CuffDesigns) ─────────────────── */}
      <div className="border border-border rounded-lg p-3">
        {/* الصف الأول: 3 تصاميم كبك مقلوب */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { svg: <CuffD1 />, k: 'cd1' },
            { svg: <CuffD2 />, k: 'cd2' },
            { svg: <CuffD3 />, k: 'cd3' },
          ].map(({ svg, k }) => (
            <Selectable key={k} label="" svg={svg} selected={has('cuffDesign', k)} onSelect={() => tog('cuffDesign', k)} />
          ))}
        </div>

        {/* الصف الثاني: 3 تصاميم كبك مقلوب حشوة */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { svg: <CuffD4 />, k: 'cd4' },
            { svg: <CuffD5 />, k: 'cd5' },
            { svg: <CuffD6 />, k: 'cd6' },
          ].map(({ svg, k }) => (
            <Selectable key={k} label="" svg={svg} selected={has('cuffDesign', k)} onSelect={() => tog('cuffDesign', k)} />
          ))}
        </div>

        {/* Checkboxes الكبك */}
        <div className="grid grid-cols-1 gap-1 mb-2">
          {[
            ['cuffOpt','كبك مقلوب كسرات'],
            ['cuffOpt','كبك مقلوب بدون كسرات'],
            ['cuffOpt','كبك حشوة كسرات'],
            ['cuffOpt','كبك حشوة بدون كسرات'],
            ['cuffOpt','سادة كيك'],
            ['cuffOpt','كم مشبك'],
            ['cuffOpt','كبك قماش مخيط'],
            ['cuffOpt','كم حشوة جبزور'],
          ].map(([cat, val]) => (
            <CB key={val} label={val} checked={has(cat, val)} onChange={() => tog(cat, val)} />
          ))}
        </div>

        {/* ملاحظة */}
        <div className="flex items-center gap-2 border-t pt-2">
          <MessageSquare className="w-5 h-5 text-primary shrink-0" />
          <Input placeholder="ملاحظة" value={m['cuffNote'] || ''} onChange={e => onMeasurementChange('cuffNote', e.target.value)} className="flex-1" />
        </div>

        {/* نوع الخياطة */}
        <div className="border border-border rounded mt-3 p-2">
          <div className="text-xs font-bold text-center bg-secondary py-1 rounded mb-2">نوع الخياطة</div>
          <div className="space-y-1">
            {[['stitchType','سوبر مان'],['stitchType','دبل جينز'],['stitchType','مبروم']].map(([cat, val]) => (
              <CB key={val} label={val} checked={has(cat, val)} onChange={() => tog(cat, val)} />
            ))}
          </div>
        </div>
      </div>

      {/* ── ملاحظة عامة ────────────────────────────────────── */}
      <div className="border border-border rounded-lg p-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary shrink-0" />
          <Input
            placeholder="ملاحظة"
            value={formData.notes}
            onChange={e => onFormDataChange({ notes: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>

      {/* ── موعد التسليم ───────────────────────────────────── */}
      <div className="border border-border rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary shrink-0" />
          <Input
            type="date"
            value={formData.deliveryDate}
            onChange={e => onFormDataChange({ deliveryDate: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>

    </div>
  )
}
