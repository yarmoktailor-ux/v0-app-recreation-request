"use client"

import Image from 'next/image'
import { useApp } from '@/lib/context'
import {
  Home,
  Users,
  BarChart3,
  CreditCard,
  Package,
  FileText,
  UserCog,
  Settings,
  Download,
  Upload,
  Key,
  Smartphone,
  MessageSquare,
  Share2,
  Youtube,
  Info,
  X
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (page: string) => void
}

const menuItems = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'clients', label: 'مقاسات العملاء', icon: Users },
  { id: 'tracking', label: 'تتبع العمل', icon: BarChart3 },
  { id: 'tailors', label: 'حسابات الخياطين والقصاصين', icon: CreditCard },
  { id: 'workers', label: 'حسابات العمال', icon: CreditCard },
  { id: 'suppliers', label: 'حسابات الموردين', icon: CreditCard },
  { id: 'inventory', label: 'المخزون', icon: Package },
  { id: 'reports', label: 'التقارير', icon: FileText },
  { id: 'user-settings', label: 'إعدادات حساب المستخدم', icon: UserCog },
  { id: 'interface-settings', label: 'قائمة إعداد واجهة المقاسات', icon: Settings },
  { id: 'backup', label: 'حفظ نسخة احتياطية', icon: Download },
  { id: 'restore', label: 'استعادة النسخة الاحتياطية', icon: Upload },
  { id: 'activate', label: 'تفعيل التطبيق', icon: Key },
  { id: 'transfer', label: 'نقل الحساب إلى جهاز آخر', icon: Smartphone },
  { id: 'contact', label: 'تواصل معنا (آرائكم ومقترحاتكم)', icon: MessageSquare },
  { id: 'share', label: 'مشاركة التطبيق', icon: Share2 },
  { id: 'youtube', label: 'شرح التطبيق على اليوتيوب', icon: Youtube },
  { id: 'about', label: 'من نحن', icon: Info },
]

export function Sidebar({ isOpen, onClose, onNavigate }: SidebarProps) {
  const { shopSettings } = useApp()

  const handleItemClick = (id: string) => {
    if (id === 'youtube') {
      window.open('https://youtube.com', '_blank')
    } else if (id === 'share') {
      if (navigator.share) {
        navigator.share({
          title: 'تطبيق اليرموك',
          text: 'تطبيق إدارة مقاسات الخياطة',
          url: window.location.href
        })
      }
    } else {
      onNavigate(id)
    }
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-sidebar z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-primary p-4 flex items-center gap-3">
          <div className="w-16 h-16 relative rounded-full overflow-hidden bg-black">
            <Image
              src={shopSettings.logo}
              alt="الشعار"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-primary-foreground font-bold">{shopSettings.name}</h2>
            <p className="text-primary-foreground/80 text-sm">{shopSettings.phone}</p>
          </div>
          <button onClick={onClose} className="text-primary-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="overflow-y-auto h-[calc(100%-112px)]">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-right"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
