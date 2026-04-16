# تعليمات البناء والتثبيت

## تثبيت البيئة المطلوبة

### لـ Desktop (Tauri):
```bash
# تثبيت Rust (مطلوب لـ Tauri)
# Windows: https://rustup.rs/
# macOS/Linux:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### لـ Mobile (Capacitor):
```bash
# Android
# تثبيت Android Studio من https://developer.android.com/studio

# iOS (macOS فقط)
# تثبيت Xcode من App Store
```

---

## البناء والتشغيل

### تشغيل التطبيق محلياً على Desktop:
```bash
npm install
npm run tauri-dev
```

### بناء تطبيق Desktop للتوزيع:
```bash
npm install
npm run tauri-build
```

**الملفات الناتجة:**
- **Windows**: `src-tauri/target/release/bundle/msi/` (ملف .msi للتثبيت)
- **macOS**: `src-tauri/target/release/bundle/dmg/` (ملف .dmg)
- **Linux**: `src-tauri/target/release/bundle/deb/` (ملف .deb)

---

### تشغيل التطبيق على Mobile:

**Android:**
```bash
npm run build
npm run cap add android
npm run cap open android
# سيفتح Android Studio - اضغط "Run"
```

**iOS:**
```bash
npm run build
npm run cap add ios
npm run cap open ios
# سيفتح Xcode - اضغط "Run"
```

---

## خطوات التثبيت على أجهزة المستخدمين

### Windows:
1. قم بتنزيل ملف `.msi` من موقعك
2. انقر نقراً مزدوجاً على الملف
3. اتبع خطوات التثبيت

### macOS:
1. قم بتنزيل ملف `.dmg`
2. افتح الملف وانسخ التطبيق إلى المجلد Applications

### Android:
1. قم بتنزيل ملف `.apk`
2. شغّل الملف على الهاتف
3. اضغط "تثبيت"

### iOS:
- استخدم TestFlight أو Apple App Store

---

## الأوامر المتاحة

```bash
# Desktop
npm run desktop              # تشغيل التطبيق محلياً
npm run desktop:build       # بناء التطبيق للتوزيع

# Mobile
npm run cap add android     # إضافة مشروع Android
npm run cap add ios        # إضافة مشروع iOS
npm run cap open android   # فتح Android Studio
npm run cap open ios       # فتح Xcode
npm run cap:build          # بناء وتحديث التطبيق
```
