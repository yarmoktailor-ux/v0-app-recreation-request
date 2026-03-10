"use client"

import { useState } from 'react'
import { ArrowRight, Download, Upload, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BackupPageProps {
  onBack: () => void
  type: 'backup' | 'restore'
}

export function BackupPage({ onBack, type }: BackupPageProps) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleBackup = () => {
    try {
      const data = localStorage.getItem('yarmouk-app-data')
      if (data) {
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `yarmouk-backup-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setStatus('success')
        setMessage('تم حفظ النسخة الاحتياطية بنجاح')
      } else {
        setStatus('error')
        setMessage('لا توجد بيانات للنسخ الاحتياطي')
      }
    } catch {
      setStatus('error')
      setMessage('حدث خطأ أثناء حفظ النسخة الاحتياطية')
    }
  }

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = event.target?.result as string
          JSON.parse(data) // Validate JSON
          localStorage.setItem('yarmouk-app-data', data)
          setStatus('success')
          setMessage('تم استعادة النسخة الاحتياطية بنجاح. يرجى إعادة تحميل الصفحة.')
        } catch {
          setStatus('error')
          setMessage('ملف غير صالح. يرجى اختيار ملف نسخة احتياطية صحيح.')
        }
      }
      reader.readAsText(file)
    }
  }

  const isBackup = type === 'backup'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground h-14 flex items-center px-4 gap-4">
        <button onClick={onBack}>
          <ArrowRight className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">
          {isBackup ? 'حفظ نسخة احتياطية' : 'استعادة النسخة الاحتياطية'}
        </h1>
      </header>

      <main className="p-6 flex flex-col items-center">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isBackup ? 'bg-green-100' : 'bg-blue-100'}`}>
          {isBackup ? (
            <Download className="w-12 h-12 text-green-500" />
          ) : (
            <Upload className="w-12 h-12 text-blue-500" />
          )}
        </div>

        <h2 className="text-xl font-bold mb-4 text-center">
          {isBackup ? 'حفظ نسخة احتياطية من بياناتك' : 'استعادة بياناتك من نسخة احتياطية'}
        </h2>

        <p className="text-muted-foreground text-center mb-8 max-w-sm">
          {isBackup 
            ? 'سيتم تنزيل ملف يحتوي على جميع بياناتك. احتفظ بهذا الملف في مكان آمن.'
            : 'اختر ملف النسخة الاحتياطية الذي تريد استعادته. سيتم استبدال البيانات الحالية.'
          }
        </p>

        {status !== 'idle' && (
          <div className={`flex items-center gap-2 p-4 rounded-lg mb-6 w-full max-w-sm ${
            status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {status === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span>{message}</span>
          </div>
        )}

        {isBackup ? (
          <Button onClick={handleBackup} className="w-full max-w-sm bg-primary">
            <Download className="w-5 h-5 ml-2" />
            تحميل النسخة الاحتياطية
          </Button>
        ) : (
          <label className="w-full max-w-sm">
            <div className="bg-primary text-primary-foreground rounded-lg p-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-primary/90 transition-colors">
              <Upload className="w-5 h-5" />
              <span>اختيار ملف النسخة الاحتياطية</span>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleRestore}
              className="hidden"
            />
          </label>
        )}

        {status === 'success' && !isBackup && (
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full max-w-sm mt-4"
            variant="outline"
          >
            إعادة تحميل الصفحة
          </Button>
        )}
      </main>
    </div>
  )
}
