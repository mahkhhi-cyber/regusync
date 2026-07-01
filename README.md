# ReguSync - AI-Powered SOC 2 Compliance Automation

## 🚀 نظرة عامة
ReguSync هو مشروع Mini SaaS لأتمتة الامتثال SOC 2. يتيح للشركات:
- توليد سياسات الأمان بالذكاء الاصطناعي
- إنشاء خرائط التحكم (Controls Mapping)
- تتبع الجاهزية للتدقيق
- إدارة التوثيق والأدلة

## 🛠️ التقنيات المستخدمة
- **Next.js 14** (App Router + TypeScript)
- **Tailwind CSS** (تصميم)
- **Prisma + PostgreSQL** (قاعدة البيانات)
- **NextAuth.js** (مصادقة المستخدمين)
- **OpenAI GPT-4o-mini** (توليد السياسات)
- **Stripe** (الاشتراكات والدفع)

## 📋 خطوات التشغيل

### 1. المتطلبات المسبقة
- Node.js 18+
- حساب GitHub
- حساب Supabase (مجاني)
- حساب OpenAI (مفتاح API)
- حساب Stripe (مفتاح تجريبي)

### 2. إنشاء قاعدة البيانات
1. اذهب إلى [supabase.com](https://supabase.com) وانشئ مشروعاً جديداً.
2. انسخ `Connection String` (URI) من إعدادات Database.
3. الصقها في ملف `.env.local` في `DATABASE_URL`.

### 3. تثبيت الاعتماديات
```bash
cd regusync
npm install
```

### 4. إعداد المتغيرات البيئية
عدل ملف `.env.local`:
```
DATABASE_URL="postgresql://..."  # من Supabase
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="أي-نص-عشوائي-طويل"
OPENAI_API_KEY="sk-..."           # من OpenAI
STRIPE_SECRET_KEY="sk_test_..."   # من Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID="price_..."       # من Stripe Dashboard
```

### 5. تهيئة قاعدة البيانات
```bash
npx prisma db push
npx prisma generate
```

### 6. تشغيل المشروع
```bash
npm run dev
```
افتح [http://localhost:3000](http://localhost:3000)

## 🏗️ هيكل المشروع
```
regusync/
├── app/                    # Next.js App Router
│   ├── api/                # APIs (Auth, Organizations, Policies, Stripe)
│   ├── dashboard/          # لوحة التحكم
│   ├── login/              # صفحة تسجيل الدخول
│   ├── register/           # صفحة التسجيل
│   └── page.tsx            # Landing Page
├── components/             # مكونات مشتركة
├── lib/                    # Prisma, OpenAI, Stripe, Utilities
├── prisma/
│   └── schema.prisma       # مخطط قاعدة البيانات
└── package.json
```

## 🎯 المميزات الحالية
✅ تسجيل حساب وتسجيل دخول  
✅ إنشاء مؤسسات (Organizations)  
✅ توليد 8 سياسات أمان بالذكاء الاصطناعي  
✅ Controls Mapping (SOC 2 Trust Services Criteria)  
✅ شريط تقدم الجاهزية  
✅ Landing Page احترافية  
✅ نظام أسعار (Pricing)  
✅ Stripe Checkout (مع فترة تجريبية 14 يوم)  

## 🚀 النشر (Deploy)
### Vercel (مجاني)
1. ادفع الكود إلى GitHub
2. اربط المستودع بـ [vercel.com](https://vercel.com)
3. أضف متغيرات البيئة في إعدادات Vercel
4. انقر Deploy

## ⚡ الخطوات التالية للتطوير
1. إضافة وضع "تصدير PDF" للسياسات
2. ربط GitHub API لجمع الأدلة تلقائياً
3. ربط AWS CloudTrail لجمع سجلات الدخول
4. إضافة التذكيرات والمهام (Tasks & Reminders)
5. دعم ISO 27001 و GDPR
6. إضافة فريق العمل (Multi-user)
7. إنشاء "Trust Page" عام للعملاء

## 📝 ملاحظة مهمة
هذا المشروع هو **MVP** (نسخة أولية). استخدمه كنقطة انطلاق، ثم طوره بناءً على ملاحظات العملاء الحقيقيين.

---
**تم بناؤه بواسطة الذكاء الاصطناعي + شريكك البشري** 🚀
