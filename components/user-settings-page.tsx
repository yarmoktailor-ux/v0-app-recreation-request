"use client"

import { useState } from 'react'
import Image from 'next/image'
import { useApp } from '@/lib/context'
import { ArrowRight, Camera } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface UserSettingsPageProps {
  onBack: () => void
}

export function UserSettingsPage({ onBack }: UserSettingsPageProps) {
  const { shopSettings, updateShopSettings } = useApp()
  const [formData, setFormData] = useState({
    name: shopSettings.name,
    phone: shopSettings.phone,
    address: shopSettings.address || '',
    logo: shopSettings.logo
  })

  const handleSave = () => {
    updateShopSettings(formData)
    onBack()
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground h-14 flex items-center px-4 gap-4">
        <button onClick={onBack}>
          <ArrowRight className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">إعدادات حساب المستخدم</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
              <Image
                src={formData.logo}
                alt="الشعار"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-muted-foreground mt-2">اضغط لتغيير الشعار</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-3">
            <label className="text-xs text-muted-foreground block mb-1">اسم المحل</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="border-0 bg-transparent"
            />
          </div>

          <div className="bg-card border border-border rounded-lg p-3">
            <label className="text-xs text-muted-foreground block mb-1">رقم الهاتف</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="border-0 bg-transparent"
              inputMode="tel"
            />
          </div>

          <div className="bg-card border border-border rounded-lg p-3">
            <label className="text-xs text-muted-foreground block mb-1">العنوان</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="border-0 bg-transparent"
            />
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground">
          حفظ التغييرات
        </Button>
      </main>
    </div>
  )
}
