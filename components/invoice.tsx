"use client"

import { forwardRef } from 'react'
import Image from 'next/image'
import { Client, Measurement, ShopSettings } from '@/lib/context'
import { QRCodeSVG } from 'qrcode.react'

interface ClientInvoiceProps {
  client: Client
  measurement: Measurement
  shopSettings: ShopSettings
}

// فاتورة العميل - تحتوي على المعلومات المالية
export const ClientInvoice = forwardRef<HTMLDivElement, ClientInvoiceProps>(
  ({ client, measurement, shopSettings }, ref) => {
    return (
      <div ref={ref} className="bg-white p-6 w-full max-w-md mx-auto text-black" dir="rtl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-2 relative">
            <Image
              src={shopSettings.logo || '/logo.png'}
              alt={shopSettings.name}
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-bold">{shopSettings.name}</h1>
          <p className="text-gray-600">{shopSettings.phone}</p>
        </div>

        {/* Invoice Info */}
        <div className="flex justify-between mb-4 text-sm">
          <span>رقم الفاتورة: {client.number}</span>
          <span>الكمية: {measurement.quantity}</span>
        </div>

        {/* Client Info */}
        <div className="space-y-3 mb-6">
          <div className="border border-gray-300 rounded p-3">
            <label className="text-xs text-gray-500 block mb-1">اسم العميل</label>
            <p className="font-bold">{client.name}</p>
          </div>

          <div className="border border-gray-300 rounded p-3">
            <label className="text-xs text-gray-500 block mb-1">نوع الصنف</label>
            <p>{measurement.fabricType || '-'}</p>
          </div>

          <div className="border border-gray-300 rounded p-3">
            <label className="text-xs text-gray-500 block mb-1">المبلغ</label>
            <p>{measurement.price}</p>
          </div>

          <div className="border border-gray-300 rounded p-3">
            <label className="text-xs text-gray-500 block mb-1">المبلغ المدفوع مسبقا</label>
            <p>{measurement.paid}</p>
          </div>

          <div className="border border-gray-300 rounded p-3">
            <label className="text-xs text-gray-500 block mb-1">المتبقي</label>
            <p className="font-bold text-red-600">{measurement.remaining}</p>
          </div>

          <div className="border border-gray-300 rounded p-3">
            <label className="text-xs text-gray-500 block mb-1">موعد التسليم</label>
            <p>{measurement.deliveryDate ? new Date(measurement.deliveryDate).toLocaleDateString('ar-SA') : '-'}</p>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <QRCodeSVG 
            value={`${shopSettings.name}\n${client.name}\n${measurement.price}`}
            size={100}
          />
        </div>

        {/* Address */}
        <p className="text-center text-sm text-gray-600">{shopSettings.address}</p>
      </div>
    )
  }
)
ClientInvoice.displayName = 'ClientInvoice'

// فاتورة المقاسات - للخياط
export const MeasurementInvoice = forwardRef<HTMLDivElement, ClientInvoiceProps>(
  ({ client, measurement, shopSettings }, ref) => {
    return (
      <div ref={ref} className="bg-white p-6 w-full max-w-md mx-auto text-black" dir="rtl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-2 relative">
            <Image
              src={shopSettings.logo || '/logo.png'}
              alt={shopSettings.name}
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-bold">{shopSettings.name}</h1>
          <p className="text-gray-600">{shopSettings.phone}</p>
        </div>

        {/* Invoice Info */}
        <div className="flex justify-between mb-4 text-sm">
          <span>رقم الفاتورة: {client.number}</span>
        </div>

        {/* Client Info */}
        <div className="space-y-3 mb-4">
          <div className="border border-gray-300 rounded p-3">
            <label className="text-xs text-gray-500 block mb-1">اسم العميل</label>
            <p className="font-bold">{client.name}</p>
          </div>

          <div className="border border-gray-300 rounded p-3">
            <label className="text-xs text-gray-500 block mb-1">نوع القماش</label>
            <p>{measurement.fabricType || '-'}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="border border-gray-300 rounded p-3">
              <label className="text-xs text-gray-500 block mb-1">الكمية</label>
              <p>{measurement.quantity}</p>
            </div>
            <div className="border border-gray-300 rounded p-3">
              <label className="text-xs text-gray-500 block mb-1">تاريخ الاستلام</label>
              <p>{new Date(measurement.createdAt).toLocaleDateString('ar-SA')}</p>
            </div>
          </div>
        </div>

        {/* Measurements */}
        <div className="border border-gray-300 rounded p-3 mb-4">
          <h3 className="font-bold mb-3 text-center bg-gray-100 -mx-3 -mt-3 p-2">المقاسات</h3>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {Object.entries(measurement.measurements || {}).map(([key, value]) => (
              value && (
                <div key={key} className="border border-gray-200 rounded p-2 text-center">
                  <label className="text-xs text-gray-500 block">{getMeasurementLabel(key)}</label>
                  <p className="font-bold">{value}</p>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Notes */}
        {measurement.notes && (
          <div className="border border-gray-300 rounded p-3 mb-4">
            <label className="text-xs text-gray-500 block mb-1">ملاحظة</label>
            <p>{measurement.notes}</p>
          </div>
        )}

        {/* Delivery Date */}
        <div className="border border-gray-300 rounded p-3 mb-4">
          <label className="text-xs text-gray-500 block mb-1">موعد التسليم</label>
          <p>{measurement.deliveryDate ? new Date(measurement.deliveryDate).toLocaleDateString('ar-SA') : '-'}</p>
        </div>

        {/* Address */}
        <p className="text-center text-sm text-gray-600">{shopSettings.address}</p>
      </div>
    )
  }
)
MeasurementInvoice.displayName = 'MeasurementInvoice'

// Helper function to get measurement labels
function getMeasurementLabel(key: string): string {
  const labels: Record<string, string> = {
    length: 'الطول',
    shoulder: 'الكتف',
    sleeveLength: 'طول الكم',
    chest: 'صدر',
    waist: 'وسط',
    hp: 'HP',
    neck: 'رقبة',
    moda: 'مودا',
    cuff: 'الكبك',
    joint: 'مفصل',
    bottomWidth: 'وسع اسفل',
    bottomCuff: 'كفة اسفل',
    sleeveS: 'طول الكم س',
    sleeveK: 'طول الكم ك',
    cuffS: 'الكبك س',
    cuffK: 'الكبك ك',
    jointS: 'مفصل س',
    jointK: 'مفصل ك',
    handWidth: 'وسع اليد',
    step: 'الخطوة',
    cuffLength: 'طول الكبك',
    // Suit measurements
    shirtLength: 'طول القميص',
    shirtShoulder: 'كتف القميص',
    shirtSleeveLength: 'طول كم القميص',
    shirtChest: 'صدر القميص',
    shirtNeck: 'رقبة القميص',
    shirtHandWidth: 'وسع يد القميص',
    shirtBelly: 'بطن القميص',
    pantsLength: 'طول البنطلون',
    pantsBelt: 'حزام',
    pantsHip: 'ورك',
    pantsThigh: 'فخذ',
    pantsKnee: 'ركبة',
    pantsOpening: 'فتحة',
    coatLength: 'طول الكوت',
    coatShoulder: 'كتف الكوت',
    coatHandLength: 'طول يد الكوت',
    coatChest: 'صدر الكوت',
    coatBelly: 'بطن الكوت',
    coatHandWidth: 'وسع يد الكوت',
    coatMiddleHand: 'وسط يد الكوت',
    vestLength: 'طول اليلق',
    vestShoulder: 'كتف اليلق',
    vestWidth: 'عرض اليلق'
  }
  return labels[key] || key
}
