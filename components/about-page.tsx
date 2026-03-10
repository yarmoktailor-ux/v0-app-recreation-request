"use client"

import Image from 'next/image'
import { ArrowRight, Mail, Phone, Globe } from 'lucide-react'

interface AboutPageProps {
  onBack: () => void
}

export function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground h-14 flex items-center px-4 gap-4">
        <button onClick={onBack}>
          <ArrowRight className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">من نحن</h1>
      </header>

      <main className="p-6 flex flex-col items-center">
        {/* Logo */}
        <div className="w-32 h-32 relative mb-6">
          <Image
            src="/logo.png"
            alt="اليرموك"
            fill
            className="object-contain"
          />
        </div>

        <h2 className="text-2xl font-bold text-primary mb-2">تطبيق اليرموك</h2>
        <p className="text-muted-foreground mb-6">الإصدار 1.0.0</p>

        <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md text-center space-y-4">
          <p className="text-foreground leading-relaxed">
            تطبيق اليرموك لإدارة مقاسات الخياطة هو تطبيق متكامل يساعد أصحاب محلات الخياطة في إدارة أعمالهم بكل سهولة ويسر.
          </p>
          
          <p className="text-foreground leading-relaxed">
            يوفر التطبيق إمكانية تسجيل مقاسات العملاء، تتبع حالة الطلبات، إدارة الحسابات، وإصدار الفواتير.
          </p>
        </div>

        {/* Contact Info */}
        <div className="mt-8 w-full max-w-md space-y-3">
          <h3 className="font-bold text-center mb-4">تواصل معنا</h3>
          
          <a 
            href="mailto:support@yarmouk.app" 
            className="flex items-center gap-3 bg-card border border-border rounded-lg p-3 hover:bg-secondary transition-colors"
          >
            <Mail className="w-5 h-5 text-primary" />
            <span>support@yarmouk.app</span>
          </a>
          
          <a 
            href="tel:+966500000000" 
            className="flex items-center gap-3 bg-card border border-border rounded-lg p-3 hover:bg-secondary transition-colors"
          >
            <Phone className="w-5 h-5 text-primary" />
            <span>+966 50 000 0000</span>
          </a>
          
          <a 
            href="https://yarmouk.app" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-card border border-border rounded-lg p-3 hover:bg-secondary transition-colors"
          >
            <Globe className="w-5 h-5 text-primary" />
            <span>www.yarmouk.app</span>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-muted-foreground text-sm mt-8">
          جميع الحقوق محفوظة 2024
        </p>
      </main>
    </div>
  )
}
