"use client"

import { Input } from '@/components/ui/input'
import { MessageSquare, Calendar } from 'lucide-react'

// ===================== SVG Components =====================

// جبزور
const JabzorSVG = ({ dots }: { dots: number }) => (
  <svg viewBox="0 0 44 70" width="36" height="58" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 4 L36 4 L36 66 L22 58 L8 66 Z" />
    {Array.from({ length: dots }).map((_, i) => (
      <circle key={i} cx="22" cy={16 + i * 10} r="2" fill="currentColor" stroke="none" />
    ))}
  </svg>
)

// جيب
const PocketSquareSVG = () => (
  <svg viewBox="0 0 52 58" width="44" height="50" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="44" height="50" rx="2" />
    <line x1="4" y1="14" x2="48" y2="14" />
  </svg>
)
const PocketNormalSVG = () => (
  <svg viewBox="0 0 52 62" width="44" height="52" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 4 L48 4 L48 48 Q28 62 4 48 Z" />
    <line x1="4" y1="14" x2="48" y2="14" />
  </svg>
)
const PocketQatariSVG = () => (
  <svg viewBox="0 0 52 66" width="44" height="56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2">
    <path d="M4 4 L48 4 L48 48 L28 66 L4 48 Z" />
    <line x1="4" y1="14" x2="48" y2="14" strokeDasharray="none" />
  </svg>
)
const PocketManagerSVG = () => (
  <svg viewBox="0 0 52 62" width="44" height="52" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 4 L48 4 L48 48 Q28 60 4 48 Z" />
    <line x1="4" y1="14" x2="48" y2="14" />
    <circle cx="26" cy="9" r="2.5" fill="currentColor" stroke="none" />
    <circle cx="18" cy="9" r="2.5" fill="currentColor" stroke="none" />
    <circle cx="34" cy="9" r="2.5" fill="currentColor" stroke="none" />
  </svg>
)

// رقبة
const NeckSquareSVG = () => (
  <svg viewBox="0 0 60 72" width="52" height="62" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 68 L6 26 L6 26 Q6 6 20 6 L40 6 Q54 6 54 26 L54 68" />
    <rect x="18" y="6" width="24" height="20" strokeWidth="1.5" />
  </svg>
)
const NeckRoundSVG = () => (
  <svg viewBox="0 0 60 72" width="52" height="62" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 68 L6 26 Q6 6 20 6 L40 6 Q54 6 54 26 L54 68" />
    <ellipse cx="30" cy="18" rx="14" ry="12" />
  </svg>
)
const NeckHiddenSVG = () => (
  <svg viewBox="0 0 60 72" width="52" height="62" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 68 L6 26 Q6 6 20 6 L40 6 Q54 6 54 26 L54 68" />
    <ellipse cx="30" cy="18" rx="14" ry="12" strokeDasharray="4 2" />
  </svg>
)

// كبك صف 1: مربع / مدور / مخفي
const CuffSquareSVG = () => (
  <svg viewBox="0 0 60 40" width="52" height="34" fill="none" stroke="currentColor" strokeWidth="1.5">
    <ellipse cx="30" cy="8" rx="22" ry="7" />
    <rect x="8" y="8" width="44" height="22" />
    <ellipse cx="30" cy="30" rx="22" ry="7" />
  </svg>
)
const CuffRoundTopSVG = () => (
  <svg viewBox="0 0 60 40" width="52" height="34" fill="none" stroke="currentColor" strokeWidth="1.5">
    <ellipse cx="30" cy="8" rx="22" ry="7" strokeDasharray="3 2" />
    <rect x="8" y="8" width="44" height="22" />
    <ellipse cx="30" cy="30" rx="22" ry="7" />
  </svg>
)
const CuffHiddenTopSVG = () => (
  <svg viewBox="0 0 60 40" width="52" height="34" fill="none" stroke="currentColor" strokeWidth="1.5">
    <ellipse cx="30" cy="8" rx="22" ry="7" strokeDasharray="3 2" />
    <rect x="8" y="8" width="44" height="22" strokeDasharray="3 2" />
    <ellipse cx="30" cy="30" rx="22" ry="7" />
    <line x1="30" y1="8" x2="30" y2="30" strokeDasharray="3 2" />
  </svg>
)

// كبك صف 2: عادي / فرنسي / مدور
const CuffNormalSVG = () => (
  <svg viewBox="0 0 60 68" width="52" height="58" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M10 4 L50 4 L50 44 L36 64 L24 64 L10 44 Z" />
    <line x1="10" y1="22" x2="50" y2="22" />
  </svg>
)
const CuffFrenchSVG = () => (
  <svg viewBox="0 0 60 68" width="52" height="58" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M10 4 L50 4 L50 44 L36 64 L24 64 L10 44 Z" />
    <line x1="10" y1="22" x2="50" y2="22" />
    <circle cx="30" cy="38" r="3" fill="currentColor" stroke="none" />
    <circle cx="24" cy="44" r="2" fill="currentColor" stroke="none" />
    <circle cx="36" cy="44" r="2" fill="currentColor" stroke="none" />
  </svg>
)
const CuffRoundBottomSVG = () => (
  <svg viewBox="0 0 60 68" width="52" height="58" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M10 4 L50 4 L50 44 Q50 64 30 64 Q10 64 10 44 Z" />
    <line x1="10" y1="22" x2="50" y2="22" />
  </svg>
)

// كبك صف 3: صيني مربع / صيني مدور / صيني مدرج
const CuffChineseSquareSVG = () => (
  <svg viewBox="0 0 60 50" width="52" height="42" fill="none" stroke="currentColor" strokeWidth="1.5">
    <ellipse cx="30" cy="12" rx="24" ry="10" />
    <path d="M6 12 L6 32 Q6 42 30 42 Q54 42 54 32 L54 12" />
    <rect x="14" y="26" width="32" height="14" rx="2" />
  </svg>
)
const CuffChineseRoundSVG = () => (
  <svg viewBox="0 0 60 50" width="52" height="42" fill="none" stroke="currentColor" strokeWidth="1.5">
    <ellipse cx="30" cy="12" rx="24" ry="10" />
    <path d="M6 12 L6 32 Q6 42 30 42 Q54 42 54 32 L54 12" />
    <ellipse cx="30" cy="33" rx="16" ry="7" />
  </svg>
)
const CuffChineseGradedSVG = () => (
  <svg viewBox="0 0 60 50" width="52" height="42" fill="none" stroke="currentColor" strokeWidth="1.5">
    <ellipse cx="30" cy="12" rx="24" ry="10" />
    <path d="M6 12 L6 32 Q6 42 30 42 Q54 42 54 32 L54 12" />
    <path d="M14 38 L14 26 Q14 22 30 22 Q46 22 46 26 L46 38" />
  </svg>
)

// تصميمات الكبك صف 1
const CuffDesign1SVG = () => (
  <svg viewBox="0 0 52 38" width="44" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="44" height="30" rx="2" />
    <line x1="16" y1="4" x2="16" y2="34" />
    <line x1="10" y1="10" x2="10" y2="28" strokeDasharray="2 2" />
    <line x1="10" y1="10" x2="16" y2="10" />
    <line x1="10" y1="28" x2="16" y2="28" />
  </svg>
)
const CuffDesign2SVG = () => (
  <svg viewBox="0 0 52 38" width="44" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="44" height="30" rx="2" />
    <line x1="16" y1="4" x2="16" y2="34" />
    <circle cx="10" cy="19" r="3" />
  </svg>
)
const CuffDesign3SVG = () => (
  <svg viewBox="0 0 52 38" width="44" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="44" height="30" rx="2" />
    <line x1="16" y1="4" x2="16" y2="34" />
  </svg>
)

// تصميمات الكبك صف 2
const CuffDesign4SVG = () => (
  <svg viewBox="0 0 52 38" width="44" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="44" height="30" rx="2" />
    <path d="M4 19 L16 12 L16 26 Z" fill="currentColor" stroke="none" />
    <circle cx="32" cy="19" r="3" />
    <line x1="35" y1="19" x2="44" y2="19" />
  </svg>
)
const CuffDesign5SVG = () => (
  <svg viewBox="0 0 52 38" width="44" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="44" height="30" rx="2" />
    <path d="M14 19 L22 12 L22 26 Z" fill="currentColor" stroke="none" />
    <circle cx="34" cy="19" r="3" />
    <line x1="37" y1="19" x2="44" y2="19" />
  </svg>
)
const CuffDesign6SVG = () => (
  <svg viewBox="0 0 52 38" width="44" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="44" height="30" rx="2" />
    <line x1="20" y1="4" x2="20" y2="34" />
    <circle cx="34" cy="19" r="3" />
    <line x1="37" y1="19" x2="44" y2="19" />
  </svg>
)

// تصميمات الكبك صف 3
const CuffDesign7SVG = () => (
  <svg viewBox="0 0 52 38" width="44" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="44" height="30" rx="2" />
    <path d="M4 19 L16 12 L16 26 Z" fill="currentColor" stroke="none" />
    <path d="M48 4 L48 34 M44 4 L44 34" />
    <circle cx="32" cy="19" r="3" />
  </svg>
)
const CuffDesign8SVG = () => (
  <svg viewBox="0 0 52 38" width="44" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="44" height="30" rx="2" />
    <path d="M12 19 L22 12 L22 26 Z" fill="currentColor" stroke="none" />
    <path d="M48 4 L48 34 M44 4 L44 34" />
    <circle cx="34" cy="19" r="3" />
  </svg>
)
const CuffDesign9SVG = () => (
  <svg viewBox="0 0 52 38" width="44" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="44" height="30" rx="2" />
    <line x1="18" y1="4" x2="18" y2="34" />
    <path d="M48 4 L48 34 M44 4 L44 34" />
    <circle cx="32" cy="19" r="3" />
  </svg>
)

// ===================== Types =====================
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

// ===================== Helper Components =====================
function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 transition-colors ${checked ? 'bg-primary border-primary' : 'border-border bg-background'}`}
    >
      {checked && <svg viewBox="0 0 12 10" width="10" height="8" fill="none" stroke="white" strokeWidth="2"><polyline points="1,5 4,8 11,1" /></svg>}
    </button>
  )
}

function DrawingCard({
  label, children, selected, onSelect, value, onValueChange
}: {
  label: string; children: React.ReactNode; selected: boolean;
  onSelect: () => void; value: string; onValueChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={onSelect}
        className={`relative border-2 rounded-lg p-1.5 flex items-center justify-center transition-colors ${selected ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}
        style={{ width: 60, height: 68 }}
      >
        {selected && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center z-10">
            <svg viewBox="0 0 12 10" width="9" height="7" fill="none" stroke="white" strokeWidth="2.5"><polyline points="1,5 4,8 11,1" /></svg>
          </div>
        )}
        <div className="text-foreground/80">{children}</div>
      </button>
      <span className="text-xs text-center leading-tight">{label}</span>
      <Input
        value={value}
        onChange={e => onValueChange(e.target.value)}
        className="h-6 text-center text-xs p-0 w-14"
        inputMode="decimal"
        placeholder=""
      />
    </div>
  )
}

function NoteField({ value, onChange, icon = false }: { value: string; onChange: (v: string) => void; icon?: boolean }) {
  return (
    <div className="flex items-center gap-2 p-2 border border-border rounded-lg">
      {icon && <MessageSquare className="w-5 h-5 text-primary flex-shrink-0" />}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="ملاحظة"
        className="flex-1 bg-transparent text-sm text-right outline-none placeholder:text-muted-foreground"
        dir="rtl"
      />
    </div>
  )
}

// ===================== Main Component =====================
export function KhaleejiMeasurements({
  formData,
  onMeasurementChange,
  onDetailToggle,
  onFormDataChange,
}: KhaleejiMeasurementsProps) {
  const m = formData.measurements
  const has = (cat: string, val: string) => formData.details[cat]?.includes(val) ?? false
  const tog = (cat: string, val: string) => onDetailToggle(cat, val)
  const val = (key: string) => m[key] || ''
  const set = (key: string) => (v: string) => onMeasurementChange(key, v)

  return (
    <div className="space-y-2 p-2 pb-6" dir="rtl">

      {/* نوع التفصيل */}
      <div className="border border-border rounded-lg p-3">
        <div className="bg-secondary text-center font-bold py-1 rounded mb-3 text-sm">نوع التفصيل</div>
        <div className="flex justify-around">
          {['سعودي', 'قطري', 'اماراتي', 'كويتي'].map(t => (
            <label key={t} className="flex items-center gap-1.5 cursor-pointer text-sm">
              <span>{t}</span>
              <Checkbox
                checked={formData.tailoringType.includes(t)}
                onChange={() => onFormDataChange({ tailoringType: formData.tailoringType.includes(t) ? formData.tailoringType.filter(x => x !== t) : [...formData.tailoringType, t] })}
              />
            </label>
          ))}
        </div>
      </div>

      {/* المقاسات الأساسية: الطول / الكتف / طول الكم */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-border">
          <div className="p-2">
            <div className="bg-secondary text-center text-xs py-1 rounded mb-2">طول الكم</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-muted-foreground">س</span>
                <Input value={val('sleeveS')} onChange={e => set('sleeveS')(e.target.value)} className="h-7 text-center text-xs px-1" inputMode="decimal" />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-muted-foreground">ك</span>
                <Input value={val('sleeveK')} onChange={e => set('sleeveK')(e.target.value)} className="h-7 text-center text-xs px-1" inputMode="decimal" />
              </div>
            </div>
          </div>
          <div className="p-2 flex flex-col items-center justify-center gap-1">
            <span className="text-xs text-muted-foreground">الكتف</span>
            <Input value={val('shoulder')} onChange={e => set('shoulder')(e.target.value)} className="h-10 text-center text-base w-full" inputMode="decimal" />
          </div>
          <div className="p-2 flex flex-col items-center justify-center gap-1">
            <span className="text-xs text-muted-foreground">الطول</span>
            <Input value={val('length')} onChange={e => set('length')(e.target.value)} className="h-10 text-center text-base w-full" inputMode="decimal" />
          </div>
        </div>
      </div>

      {/* وسع الصدر */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-secondary text-center text-sm font-medium py-1.5">وسع الصدر</div>
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-border">
          {[['HP','hp'],['وسط','waist'],['صدر','chest']].map(([lbl, key]) => (
            <div key={key} className="p-2 flex flex-col items-center justify-center gap-1">
              <span className="text-xs text-muted-foreground">{lbl}</span>
              <Input value={val(key)} onChange={e => set(key)(e.target.value)} className="h-10 text-center text-base w-full" inputMode="decimal" />
            </div>
          ))}
        </div>
      </div>

      {/* رقبة / مودا / الكبك */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-border">
          <div className="p-2">
            <div className="bg-secondary text-center text-xs py-1 rounded mb-2">الكبك</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-muted-foreground">س</span>
                <Input value={val('cuffS')} onChange={e => set('cuffS')(e.target.value)} className="h-7 text-center text-xs px-1" inputMode="decimal" />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-muted-foreground">ك</span>
                <Input value={val('cuffK')} onChange={e => set('cuffK')(e.target.value)} className="h-7 text-center text-xs px-1" inputMode="decimal" />
              </div>
            </div>
          </div>
          <div className="p-2 flex flex-col items-center justify-center gap-1">
            <span className="text-xs text-muted-foreground">مودا</span>
            <Input value={val('moda')} onChange={e => set('moda')(e.target.value)} className="h-10 text-center text-base w-full" inputMode="decimal" />
          </div>
          <div className="p-2 flex flex-col items-center justify-center gap-1">
            <span className="text-xs text-muted-foreground">رقبة</span>
            <Input value={val('neck')} onChange={e => set('neck')(e.target.value)} className="h-10 text-center text-base w-full" inputMode="decimal" />
          </div>
        </div>
      </div>

      {/* وسع أسفل / كفة أسفل / مفصل */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-border">
          <div className="p-2">
            <div className="bg-secondary text-center text-xs py-1 rounded mb-2">مفصل</div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-muted-foreground">س</span>
                <Input value={val('jointS')} onChange={e => set('jointS')(e.target.value)} className="h-7 text-center text-xs px-1" inputMode="decimal" />
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-muted-foreground">ك</span>
                <Input value={val('jointK')} onChange={e => set('jointK')(e.target.value)} className="h-7 text-center text-xs px-1" inputMode="decimal" />
              </div>
            </div>
          </div>
          <div className="p-2 flex flex-col items-center justify-center gap-1">
            <span className="text-xs text-muted-foreground">كفة اسفل</span>
            <Input value={val('bottomCuff')} onChange={e => set('bottomCuff')(e.target.value)} className="h-10 text-center text-base w-full" inputMode="decimal" />
          </div>
          <div className="p-2 flex flex-col items-center justify-center gap-1">
            <span className="text-xs text-muted-foreground">وسع اسفل</span>
            <Input value={val('bottomWidth')} onChange={e => set('bottomWidth')(e.target.value)} className="h-10 text-center text-base w-full" inputMode="decimal" />
          </div>
        </div>
      </div>

      {/* قسم الجبزور */}
      <div className="border border-border rounded-lg p-3">
        <div className="flex gap-2">
          {/* رسومات الجبزور */}
          <div className="flex gap-2 flex-1 justify-around">
            {[
              { key:'jabzorStyle', val:'1نقطة', dots:1 },
              { key:'jabzorStyle', val:'2نقطة', dots:2 },
              { key:'jabzorStyle', val:'3نقطة', dots:3 },
              { key:'jabzorStyle', val:'4نقطة', dots:4 },
            ].map(item => (
              <div key={item.val} className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => tog(item.key, item.val)}
                  className={`relative border-2 rounded-lg flex items-center justify-center transition-colors ${has(item.key, item.val) ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}
                  style={{ width: 46, height: 68 }}
                >
                  {has(item.key, item.val) && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center z-10">
                      <svg viewBox="0 0 12 10" width="9" height="7" fill="none" stroke="white" strokeWidth="2.5"><polyline points="1,5 4,8 11,1" /></svg>
                    </div>
                  )}
                  <JabzorSVG dots={item.dots} />
                </button>
                <Input value={val(`jabzor_${item.val}`)} onChange={e => set(`jabzor_${item.val}`)(e.target.value)} className="h-6 text-center text-xs p-0 w-12" inputMode="decimal" />
              </div>
            ))}
          </div>
          {/* خيارات السحاب + رسمة */}
          <div className="flex flex-col gap-2 min-w-[90px]">
            <label className="flex items-center gap-2 justify-end text-sm cursor-pointer">
              <span>سحاب مخفي</span>
              <Checkbox checked={has('zipper','مخفي')} onChange={() => tog('zipper','مخفي')} />
            </label>
            <label className="flex items-center gap-2 justify-end text-sm cursor-pointer">
              <span>سحاب باين</span>
              <Checkbox checked={has('zipper','باين')} onChange={() => tog('zipper','باين')} />
            </label>
            <div className="border border-border rounded p-1 flex items-center justify-center mt-1" style={{ width: 52, height: 52, alignSelf: 'flex-end' }}>
              <svg viewBox="0 0 44 52" width="38" height="46" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="4" width="20" height="44" rx="2" />
                <rect x="24" y="4" width="16" height="44" rx="2" />
                <line x1="4" y1="20" x2="24" y2="20" />
              </svg>
            </div>
          </div>
        </div>
        {/* ملاحظة للجبزور */}
        <div className="mt-3">
          <NoteField icon value={val('jabzorNote')} onChange={v => set('jabzorNote')(v)} />
        </div>
      </div>

      {/* قسم الجيوب */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-x-reverse divide-border">
          {/* يمين: رسومات الجيوب */}
          <div className="p-2">
            <div className="flex justify-around mb-2">
              {[
                { label:'مربع', key:'مربع', El: PocketSquareSVG },
                { label:'عادي', key:'عادي', El: PocketNormalSVG },
                { label:'قطري', key:'قطري', El: PocketQatariSVG },
                { label:'مديري', key:'مديري', El: PocketManagerSVG },
              ].map(item => (
                <DrawingCard
                  key={item.key}
                  label={item.label}
                  selected={has('pocket', item.key)}
                  onSelect={() => tog('pocket', item.key)}
                  value={val(`pocket_${item.key}`)}
                  onValueChange={set(`pocket_${item.key}`)}
                >
                  <item.El />
                </DrawingCard>
              ))}
            </div>
            {/* قلم / نزول جيب */}
            <div className="flex items-center gap-2 mt-2 justify-end">
              <span className="text-xs">نزول جيب</span>
              <Input value={val('pocketDrop')} onChange={e => set('pocketDrop')(e.target.value)} className="h-7 text-center text-xs w-16" inputMode="decimal" />
              <span className="text-xs">قلم</span>
              <Checkbox checked={has('pocket','قلم')} onChange={() => tog('pocket','قلم')} />
            </div>
          </div>
          {/* يسار: checkboxes */}
          <div className="p-2 flex flex-col gap-2">
            {['جيب مخفي','جيب باين','جيب جبزور','جيب باين مخفي'].map(item => (
              <label key={item} className="flex items-center gap-2 justify-end text-sm cursor-pointer">
                <span>{item}</span>
                <Checkbox checked={has('pocketType', item)} onChange={() => tog('pocketType', item)} />
              </label>
            ))}
          </div>
        </div>
        {/* ملاحظة الجيوب */}
        <div className="grid grid-cols-2 divide-x divide-x-reverse divide-border border-t border-border">
          <div className="p-2"><NoteField value={val('pocketNote1')} onChange={set('pocketNote1')} /></div>
          <div className="p-2"><NoteField icon value={val('pocketNote2')} onChange={set('pocketNote2')} /></div>
        </div>
      </div>

      {/* قسم الرقبة */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-x-reverse divide-border">
          {/* يمين: رسومات أنواع الرقبة */}
          <div className="p-3">
            <div className="flex justify-around gap-2">
              {[
                { label:'مربع', key:'مربع', El: NeckSquareSVG },
                { label:'مدور', key:'مدور', El: NeckRoundSVG },
                { label:'مخفي', key:'مخفي', El: NeckHiddenSVG },
              ].map(item => (
                <DrawingCard
                  key={item.key}
                  label={item.label}
                  selected={has('neckType', item.key)}
                  onSelect={() => tog('neckType', item.key)}
                  value={val(`neck_${item.key}`)}
                  onValueChange={set(`neck_${item.key}`)}
                >
                  <item.El />
                </DrawingCard>
              ))}
            </div>
          </div>
          {/* يسار: checkboxes الرقبة */}
          <div className="p-2 flex flex-col gap-1.5 justify-center">
            {['ب.1 صدف','ب.2 صدف','ب.1 مخفي B','ب.2 مخفي B'].map(item => (
              <label key={item} className="flex items-center gap-2 justify-end text-sm cursor-pointer">
                <span>{item}</span>
                <Checkbox checked={has('neckOption', item)} onChange={() => tog('neckOption', item)} />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* قسم الكبك (الكبك بالتفصيل) */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-x-reverse divide-border">
          {/* يمين: رسومات 3 صفوف × 3 */}
          <div className="p-2 space-y-3">
            {/* صف 1: مربع / مدور / مخفي */}
            <div className="flex justify-around gap-1">
              {[
                { label:'مربع', key:'مربع', El: CuffSquareSVG },
                { label:'مدور', key:'مدور', El: CuffRoundTopSVG },
                { label:'مخفي', key:'مخفي', El: CuffHiddenTopSVG },
              ].map(item => (
                <DrawingCard key={item.key} label={item.label} selected={has('cuffTop', item.key)} onSelect={() => tog('cuffTop', item.key)} value={val(`cuffTop_${item.key}`)} onValueChange={set(`cuffTop_${item.key}`)}>
                  <item.El />
                </DrawingCard>
              ))}
            </div>
            {/* صف 2: عادي / فرنسي / مدور */}
            <div className="flex justify-around gap-1">
              {[
                { label:'عادي', key:'عادي', El: CuffNormalSVG },
                { label:'فرنسي', key:'فرنسي', El: CuffFrenchSVG },
                { label:'مدور', key:'مدور2', El: CuffRoundBottomSVG },
              ].map(item => (
                <DrawingCard key={item.key} label={item.label} selected={has('cuffMid', item.key)} onSelect={() => tog('cuffMid', item.key)} value={val(`cuffMid_${item.key}`)} onValueChange={set(`cuffMid_${item.key}`)}>
                  <item.El />
                </DrawingCard>
              ))}
            </div>
            {/* صف 3: صيني */}
            <div className="flex justify-around gap-1">
              {[
                { label:'صيني مربع', key:'صيني مربع', El: CuffChineseSquareSVG },
                { label:'صيني مدور', key:'صيني مدور', El: CuffChineseRoundSVG },
                { label:'صيني مدرج', key:'صيني مدرج', El: CuffChineseGradedSVG },
              ].map(item => (
                <DrawingCard key={item.key} label={item.label} selected={has('cuffBot', item.key)} onSelect={() => tog('cuffBot', item.key)} value={val(`cuffBot_${item.key}`)} onValueChange={set(`cuffBot_${item.key}`)}>
                  <item.El />
                </DrawingCard>
              ))}
            </div>
          </div>
          {/* يسار: checkboxes الكبك */}
          <div className="p-2 flex flex-col gap-1.5">
            {['1 زرار','2 زرار','1.تركيبة','2.تركيبة'].map(item => (
              <label key={item} className="flex items-center gap-2 justify-end text-sm cursor-pointer">
                <span>{item}</span>
                <Checkbox checked={has('cuffOption', item)} onChange={() => tog('cuffOption', item)} />
              </label>
            ))}
            <div className="flex items-center gap-2 justify-end mt-1">
              <span className="text-xs">نزول زرار</span>
              <Input value={val('cuffButtonDrop')} onChange={e => set('cuffButtonDrop')(e.target.value)} className="h-7 text-center text-xs w-14" inputMode="decimal" />
            </div>
            {['ب.1','ب.2','حديدة جيب'].map(item => (
              <label key={item} className="flex items-center gap-2 justify-end text-sm cursor-pointer">
                <span>{item}</span>
                <Checkbox checked={has('cuffOption2', item)} onChange={() => tog('cuffOption2', item)} />
              </label>
            ))}
          </div>
        </div>
        {/* ملاحظة الكبك */}
        <div className="grid grid-cols-2 divide-x divide-x-reverse divide-border border-t border-border">
          <div className="p-2"><NoteField value={val('cuffNote1')} onChange={set('cuffNote1')} /></div>
          <div className="p-2"><NoteField value={val('cuffNote2')} onChange={set('cuffNote2')} /></div>
        </div>
      </div>

      {/* قسم تصميمات الكبك + خيارات */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-x-reverse divide-border">
          {/* يمين: 3 صفوف من رسومات تصميم الكبك */}
          <div className="p-2 space-y-2">
            <div className="flex justify-around gap-1">
              {[
                { label:'', key:'d1', El: CuffDesign1SVG },
                { label:'', key:'d2', El: CuffDesign2SVG },
                { label:'', key:'d3', El: CuffDesign3SVG },
              ].map(item => (
                <button key={item.key} type="button" onClick={() => tog('cuffDesign', item.key)}
                  className={`border-2 rounded p-1 transition-colors ${has('cuffDesign', item.key) ? 'border-primary bg-primary/5' : 'border-border'}`}
                  style={{ width: 54, height: 42 }}>
                  <item.El />
                </button>
              ))}
            </div>
            <div className="flex justify-around gap-1">
              {[
                { label:'', key:'d4', El: CuffDesign4SVG },
                { label:'', key:'d5', El: CuffDesign5SVG },
                { label:'', key:'d6', El: CuffDesign6SVG },
              ].map(item => (
                <button key={item.key} type="button" onClick={() => tog('cuffDesign', item.key)}
                  className={`border-2 rounded p-1 transition-colors ${has('cuffDesign', item.key) ? 'border-primary bg-primary/5' : 'border-border'}`}
                  style={{ width: 54, height: 42 }}>
                  <item.El />
                </button>
              ))}
            </div>
            <div className="flex justify-around gap-1">
              {[
                { label:'', key:'d7', El: CuffDesign7SVG },
                { label:'', key:'d8', El: CuffDesign8SVG },
                { label:'', key:'d9', El: CuffDesign9SVG },
              ].map(item => (
                <button key={item.key} type="button" onClick={() => tog('cuffDesign', item.key)}
                  className={`border-2 rounded p-1 transition-colors ${has('cuffDesign', item.key) ? 'border-primary bg-primary/5' : 'border-border'}`}
                  style={{ width: 54, height: 42 }}>
                  <item.El />
                </button>
              ))}
            </div>
          </div>
          {/* يسار: checkboxes تصميم الكبك */}
          <div className="p-2 flex flex-col gap-1.5">
            {['كبك مقلوب كسرات','كبك مقلوب بدون كسرات','كبك حشوة كسرات','كبك حشوة بدون كسرات','سادة كيك','كم مشبك','كبك قماش مخيط','كم حشوة جبزور'].map(item => (
              <label key={item} className="flex items-center gap-2 justify-end text-xs cursor-pointer">
                <span>{item}</span>
                <Checkbox checked={has('cuffDesignOpt', item)} onChange={() => tog('cuffDesignOpt', item)} />
              </label>
            ))}
          </div>
        </div>
        {/* ملاحظة + نوع الخياطة */}
        <div className="grid grid-cols-2 divide-x divide-x-reverse divide-border border-t border-border">
          <div className="p-2">
            <NoteField value={val('cuffDesignNote')} onChange={set('cuffDesignNote')} />
          </div>
          <div className="p-2">
            <div className="bg-secondary text-center text-xs py-1 rounded mb-2">نوع الخياطة</div>
            {['سوبر مان','دبل جينز','مبروم'].map(item => (
              <label key={item} className="flex items-center gap-2 justify-end text-sm cursor-pointer mb-1">
                <span>{item}</span>
                <Checkbox checked={has('stitchType', item)} onChange={() => tog('stitchType', item)} />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ملاحظة عامة */}
      <NoteField icon value={val('generalNote')} onChange={set('generalNote')} />

      {/* موعد التسليم */}
      <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
        <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
        <Input
          type="date"
          value={formData.deliveryDate}
          onChange={e => onFormDataChange({ deliveryDate: e.target.value })}
          className="border-0 bg-transparent flex-1 text-right"
          dir="rtl"
        />
        <span className="text-sm text-muted-foreground">موعد التسليم</span>
      </div>

    </div>
  )
}
