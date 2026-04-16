#!/bin/bash

echo "🚀 اليرموك - تطبيق الخياطة والتفصيل"
echo "=================================="
echo ""
echo "اختر ما تريد:"
echo "1) تشغيل التطبيق محلياً (Desktop)"
echo "2) بناء تطبيق Desktop للتوزيع"
echo "3) إعداد تطبيق Android"
echo "4) إعداد تطبيق iOS (macOS فقط)"
echo ""
read -p "اختيارك (1-4): " choice

case $choice in
  1)
    echo "جاري التشغيل المحلي..."
    npm run tauri-dev
    ;;
  2)
    echo "جاري البناء..."
    npm install
    npm run build
    npm run tauri-build
    echo "✅ تم البناء بنجاح!"
    echo "ستجد الملفات في: src-tauri/target/release/bundle/"
    ;;
  3)
    echo "جاري إعداد Android..."
    npm install
    npm run build
    npm run cap add android
    npm run cap open android
    ;;
  4)
    echo "جاري إعداد iOS..."
    npm install
    npm run build
    npm run cap add ios
    npm run cap open ios
    ;;
  *)
    echo "اختيار غير صحيح"
    ;;
esac
