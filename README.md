# Mandiri Leads Monitoring — React + Vite

Dashboard monitoring potensi Intensifikasi & Ekstensifikasi  
**KCP Jakarta Grand Slipi Tower · Area Greenville 16521**

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite 5** (bundler, dev server)
- **Tailwind CSS 3**
- **Supabase** (PostgreSQL database)
- **lucide-react** (icons)
- **xlsx** (export Excel)

---

## Setup

### 1. Clone & Install

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` → `.env` dan isi nilai Supabase:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ **Penting:** Vite membutuhkan prefix `VITE_` untuk env vars yang diakses di browser.  
> Berbeda dengan Next.js yang menggunakan `NEXT_PUBLIC_`.

### 3. Run Development

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173)

### 4. Build Production

```bash
npm run build
```

Output ke folder `dist/`.

---

## Deploy ke Vercel

1. Push repo ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Set **Framework Preset** → **Vite**
4. Set **Environment Variables** di Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy ✅

`vercel.json` sudah dikonfigurasi untuk SPA routing.

---

## Struktur Proyek

```
src/
├── components/
│   ├── ui/               # Komponen UI reusable
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── progress.tsx
│   │   ├── table.tsx
│   │   └── tabs.tsx
│   ├── dashboardHeader.tsx   # Header + clock + export
│   ├── statsCards.tsx        # 9 stats cards
│   ├── progressSection.tsx   # Progress by Leads & 3P
│   ├── filterBar.tsx         # Search + filter controls
│   ├── leadTable.tsx         # Sortable paginated table
│   ├── phoneBookPanel.tsx    # Side panel detail nasabah
│   └── leadForm.tsx          # Modal form add/edit
├── lib/
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Helpers, constants, formatters
├── types/
│   └── index.ts          # TypeScript types
├── App.tsx               # Main page / root component
├── main.tsx              # React entry point
└── index.css             # Global styles + Tailwind
```

---

## Fitur

- 📊 **Stats Cards** — 9 metrik real-time (potensi, realisasi, FU, closing, dll)
- 📈 **Progress Section** — distribusi by Leads Type & Segmen 3P
- 📋 **Lead Table** — sortable, paginated, filter multi-dimensi
- 📱 **Phone Book Panel** — detail kontak, WA/email/LinkedIn, Google Maps
- ✏️ **Lead Form** — add/edit nasabah dengan chip keterangan
- 📤 **Export XLSX** — download semua data ke Excel
- 🔄 **Live Sync** — refresh data dari Supabase
- 🔍 **Filter** — by 3P, Leads Type, Hasil FU, search nama
- 📝 **Change Log** — audit trail perubahan PIC
