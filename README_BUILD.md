# 🚀 دليل التثبيت والبناء

تم تحويل التطبيق إلى **تطبيق قابل للتثبيت** على جميع المنصات:

## المتطلبات

### لـ Desktop (Windows/Mac/Linux):
- **Node.js** (v16+)
- **Rust** (لتشغيل Tauri)
  - Windows: https://rustup.rs/
  - macOS/Linux: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

### لـ Mobile (iOS/Android):
- **Android Studio** (للـ Android) — https://developer.android.com/studio
- **Xcode** (للـ iOS على macOS) — من App Store

---

## خطوات البناء السريعة

### 1️⃣ تشغيل محلي (للاختبار)

```bash
# Desktop
npm install
npm run tauri-dev

# أو استخدم السكريبت
bash build.sh  # ثم اختر 1
```

### 2️⃣ بناء للتوزيع

#### تطبيق Desktop:
```bash
npm install
npm run tauri-build
```
**الملفات الناتجة في:**
- Windows: `src-tauri/target/release/bundle/msi/*.msi`
- macOS: `src-tauri/target/release/bundle/dmg/*.dmg`
- Linux: `src-tauri/target/release/bundle/deb/*.deb`

#### تطبيق Mobile:

**Android:**
```bash
npm run cap add android
npm run cap open android
# بناء من Android Studio
```

**iOS:**
```bash
npm run cap add ios
npm run cap open ios
# بناء من Xcode
```

---

## كيفية التثبيت للمستخدمين

### Windows ✅
1. تنزيل `.msi`
2. تشغيل الملف
3. اتباع خطوات التثبيت

### macOS ✅
1. تنزيل `.dmg`
2. فتح الملف
3. سحب التطبيق إلى المجلد Applications

### Linux ✅
1. تنزيل `.deb`
2. تثبيت: `sudo dpkg -i tailor-app.deb`

### Android ✅
1. تنزيل `.apk` أو من Play Store
2. تشغيل على الهاتف
3. اضغط "تثبيت"

### iOS ✅
- من TestFlight أو App Store

---

## الأوامر الكاملة

```bash
# Desktop
npm run tauri-dev          # تشغيل محلي
npm run tauri-build        # بناء

# Mobile
npm run cap add android    # إضافة Android
npm run cap add ios       # إضافة iOS
npm run cap open android  # فتح Android Studio
npm run cap open ios      # فتح Xcode
npm run cap:build         # بناء وتحديث
```

---

## 📁 هيكل المشروع

```
.
├── app/                    # Next.js app
├── components/             # مكونات React
├── lib/                    # دوال مساعدة
├── public/                 # ملفات عامة
├── src-tauri/              # كود Tauri (Rust)
│   ├── src/
│   ├── Cargo.toml
│   └── tauri.conf.json
├── capacitor.config.json   # إعدادات Capacitor
├── package.json
└── BUILD_INSTRUCTIONS.md
```

---

## 🆘 استكشاف الأخطاء

**خطأ Rust:**
```bash
rustup update
rustup target add x86_64-pc-windows-msvc  # Windows
```

**خطأ Android:**
- تأكد من JAVA_HOME في متغيرات البيئة
- استخدم Android Studio SDK

**خطأ iOS:**
- تأكد من Xcode وحديثة
- `pod install` في مجلد ios

---

للمزيد من التفاصيل، شاهد `BUILD_INSTRUCTIONS.md`
