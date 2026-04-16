"use client"

import { forwardRef } from 'react'
import { Client, Measurement, ShopSettings } from '@/lib/context'
import { QRCodeSVG } from 'qrcode.react'
import { getMeasurementLabel } from '@/lib/measurements-labels'

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
        <div className="text-center mb-6 border-b border-gray-300 pb-4">
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

        {/* Address */}
        <p className="text-center text-sm text-gray-600 border-t border-gray-200 pt-4">{shopSettings.address}</p>
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
        <div className="text-center mb-6 border-b border-gray-300 pb-4">
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
