"use client"

import { useState } from 'react'
import { useApp } from '@/lib/context'
import { ArrowRight, MoreVertical, Plus, Check, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface MeasurementSettingsPageProps {
  onBack: () => void
}

type SubPage = 
  | 'menu'
  | 'fabricTypes' 
  | 'neckType' 
  | 'jabzor' 
  | 'hand' 
  | 'pockets' 
  | 'tailoringType' 
  | 'button'

const SUB_PAGES: { key: SubPage; label: string }[] = [
  { key: 'fabricTypes', label: 'نوع القماش' },
  { key: 'neckType',    label: 'اعدادات قائمة الرقبة' },
  { key: 'jabzor',      label: 'اعدادات قائمة الجبزور' },
  { key: 'hand',        label: 'اعدادات قائمة اليد' },
  { key: 'pockets',     label: 'اعدادات قائمة الجيوب' },
  { key: 'tailoringType', label: 'اعدادات قائمة نوع التفصيل' },
  { key: 'button',      label: 'اعدادات قائمة الزرار' },
]

interface ListPageProps {
  title: string
  items: string[]
  onAdd: (value: string) => void
  onEdit: (oldVal: string, newVal: string) => void
  onDelete: (val: string) => void
  onBack: () => void
}

function ListPage({ title, items, onAdd, onEdit, onDelete, onBack }: ListPageProps) {
  const [addDialog, setAddDialog] = useState(false)
  const [editDialog, setEditDialog] = useState<{ open: boolean; value: string }>({ open: false, value: '' })
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; value: string }>({ open: false, value: '' })
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim())
      setInputValue('')
      setAddDialog(false)
    }
  }

  const handleEdit = () => {
    if (inputValue.trim()) {
      onEdit(editDialog.value, inputValue.trim())
      setInputValue('')
      setEditDialog({ open: false, value: '' })
    }
  }

  const handleDelete = () => {
    onDelete(deleteDialog.value)
    setDeleteDialog({ open: false, value: '' })
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#1a1a1a' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14" style={{ background: '#c9a84c' }}>
        <button onClick={onBack}>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-bold text-white text-center flex-1">{title}</h1>
        <div className="w-6" />
      </header>

      {/* List */}
      <div className="flex-1 p-3 space-y-2">
        {items.map((item, index) => (
          <div
            key={item}
            className="flex items-center rounded-xl overflow-hidden border border-[#c9a84c]"
            style={{ background: '#ffffff' }}
          >
            {/* 3-dots menu - left */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-3 py-5 flex flex-col gap-1">
                  <span className="w-1 h-1 rounded-full" style={{ background: '#c9a84c' }} />
                  <span className="w-1 h-1 rounded-full" style={{ background: '#c9a84c' }} />
                  <span className="w-1 h-1 rounded-full" style={{ background: '#c9a84c' }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-white border border-gray-200 shadow-lg rounded-xl min-w-[140px]">
                <DropdownMenuItem
                  className="text-right text-base py-3 justify-end"
                  onClick={() => { setEditDialog({ open: true, value: item }); setInputValue(item) }}
                >
                  تعديل
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-right text-base py-3 justify-end text-red-500"
                  onClick={() => setDeleteDialog({ open: true, value: item })}
                >
                  حذف
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Name - center */}
            <span className="flex-1 text-center text-xl font-bold text-black">{item}</span>

            {/* Number - right */}
            <div
              className="w-14 h-full flex items-center justify-center text-xl font-bold text-[#c9a84c] rounded-l-xl"
              style={{ background: '#1a1a1a', minHeight: '56px' }}
            >
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => { setInputValue(''); setAddDialog(true) }}
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: '#c9a84c' }}
      >
        <Plus className="w-7 h-7 text-white" />
      </button>

      {/* Add Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-right">إضافة جديد</DialogTitle>
          </DialogHeader>
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="أدخل الاسم"
            className="text-right"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <DialogFooter className="flex gap-2 flex-row-reverse">
            <Button onClick={handleAdd} style={{ background: '#c9a84c' }} className="text-white flex-1">
              <Check className="w-4 h-4 ml-1" /> إضافة
            </Button>
            <Button variant="outline" onClick={() => setAddDialog(false)} className="flex-1">
              <X className="w-4 h-4 ml-1" /> إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(o) => setEditDialog({ ...editDialog, open: o })}>
        <DialogContent className="bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-right">تعديل</DialogTitle>
          </DialogHeader>
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="text-right"
            onKeyDown={e => e.key === 'Enter' && handleEdit()}
          />
          <DialogFooter className="flex gap-2 flex-row-reverse">
            <Button onClick={handleEdit} style={{ background: '#c9a84c' }} className="text-white flex-1">
              <Check className="w-4 h-4 ml-1" /> حفظ
            </Button>
            <Button variant="outline" onClick={() => setEditDialog({ open: false, value: '' })} className="flex-1">
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(o) => setDeleteDialog({ ...deleteDialog, open: o })}>
        <DialogContent className="bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-right">حذف</DialogTitle>
          </DialogHeader>
          <p className="text-center py-2">هل تريد حذف "{deleteDialog.value}"؟</p>
          <DialogFooter className="flex gap-2 flex-row-reverse">
            <Button onClick={handleDelete} variant="destructive" className="flex-1">حذف</Button>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, value: '' })} className="flex-1">إلغاء</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function MeasurementSettingsPage({ onBack }: MeasurementSettingsPageProps) {
  const {
    fabricTypes, addFabricType, updateFabricType, removeFabricType,
    optionLists, addOptionToList, updateOptionInList, removeOptionFromList
  } = useApp()
  const [currentPage, setCurrentPage] = useState<SubPage>('menu')

  const getItems = (key: SubPage): string[] => {
    if (key === 'fabricTypes') return fabricTypes
    return optionLists[key] || []
  }

  const handleAdd = (key: SubPage, value: string) => {
    if (key === 'fabricTypes') addFabricType(value)
    else addOptionToList(key, value)
  }

  const handleEdit = (key: SubPage, oldVal: string, newVal: string) => {
    if (key === 'fabricTypes') updateFabricType(oldVal, newVal)
    else updateOptionInList(key, oldVal, newVal)
  }

  const handleDelete = (key: SubPage, value: string) => {
    if (key === 'fabricTypes') removeFabricType(value)
    else removeOptionFromList(key, value)
  }

  // Sub page
  if (currentPage !== 'menu') {
    const pageInfo = SUB_PAGES.find(p => p.key === currentPage)!
    return (
      <ListPage
        title={pageInfo.label}
        items={getItems(currentPage)}
        onAdd={(v) => handleAdd(currentPage, v)}
        onEdit={(o, n) => handleEdit(currentPage, o, n)}
        onDelete={(v) => handleDelete(currentPage, v)}
        onBack={() => setCurrentPage('menu')}
      />
    )
  }

  // Main menu
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14" style={{ background: '#c9a84c' }}>
        <button onClick={onBack}>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-bold text-white text-center flex-1">اعدادات تصميم الواجهة</h1>
        <div className="w-6" />
      </header>

      <main className="p-4 space-y-3 mt-4">
        {/* Dropdown selector */}
        <div className="border border-[#c9a84c] rounded-xl p-3 mb-6">
          <p className="text-xs text-[#c9a84c] text-right mb-1">اختر واجهة الاعدادات</p>
          <div className="flex items-center justify-between">
            <span className="text-foreground font-bold text-right flex-1">مقاسات الاثواب</span>
            <span className="text-foreground ml-2">▼</span>
          </div>
        </div>

        {/* Buttons list */}
        {SUB_PAGES.map((page) => (
          <button
            key={page.key}
            onClick={() => setCurrentPage(page.key)}
            className="w-full py-4 rounded-xl text-center text-lg font-bold"
            style={{ background: '#1a1a1a', color: '#c9a84c' }}
          >
            {page.label}
          </button>
        ))}
      </main>
    </div>
  )
}
