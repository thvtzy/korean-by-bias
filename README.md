# Korean by Bias ✦

**Koleksi kata dari lagu & variety show favoritmu — kayak photocard binder!**

A vocabulary tracker built for K-pop fans learning Korean. Add words as photocards, review with SRS flashcards, track your streak — all wrapped in a cute pastel aesthetic.

![stack](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![stack](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![stack](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss) ![stack](https://img.shields.io/badge/Supabase-database-green?logo=supabase)

---

## ✦ Fitur

- 📸 **Photocard Binder** — kata-kata ditampilkan sebagai photocard 3:4 dalam grid ala binder koleksi
- ✨ **Holo shimmer** — kartu mastered (di-review 3x+) bersinar efek holografi
- ➕ **Smart input** — ketik `사랑해 = I love you` langsung auto-detect kata & artinya
- 🎴 **SRS Flashcard** — spaced repetition pake algoritma SM-2, flip kartu buat liat artinya
- 🔥 **Streak tracker** — hitung berapa hari berturut-turut kamu nambah/review kata
- 🎵📺💬 **Source auto-detect** — deteksi sumber dari lagu, variety show, atau live stream
- 🌸 **Light theme** — aesthetic cerah ala album K-pop (pastel pink, lavender, cream)
- 💾 **Cloud sync** — simpan di Supabase, akses di mana aja

---

## ✦ Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 3, Framer Motion |
| Backend | Supabase (Auth, PostgreSQL, Row Level Security) |
| SRS | SM-2 algorithm (built-in) |
| Hosting | Vercel |

---

## ✦ Quick Start

```bash
# Clone
git clone https://github.com/thvtzy/korean-by-bias.git
cd korean-by-bias

# Install
npm install

# Setup env
cp .env.example .env.local
# Isi NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY

# Run
npm run dev
# Buka http://localhost:3000
```

---

## ✦ Supabase Setup

1. Bikin project di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** → jalankan `supabase/migrations/001_initial_schema.sql`
3. Copy **Project URL** & **anon public key** dari Settings → API
4. Masukin ke `.env.local`
5. Di Supabase Auth → URL Configuration: setel Site URL + Redirect URLs

---

## ✦ Halaman

| Route | Keterangan |
|---|---|
| `/` | Dashboard — photocard grid + FAB tambah kata |
| `/review` | SRS flashcard session |
| `/stats` | Statistik + progress tracker |
| `/login` | Magic link login (atau tap 5x judul buat bypass admin 😉) |

---

## ✦ Keyboard Shortcuts

| Shortcut | Fungsi |
|---|---|
| `/` atau `+` | Buka bottom sheet tambah kata |
| `Enter` | Submit smart input |
| `Esc` | Tutup bottom sheet |
| `1`-`4` | Rate card saat review |

---

## ✦ Struktur Project

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Dashboard (photocard grid)
│   ├── review/           # SRS flashcard review
│   ├── stats/            # Stats page
│   └── login/            # Auth page
├── components/
│   ├── binder/           # PhotoCard, PhotoCardGrid, AddWordSheet, SmartWordInput
│   ├── review/           # PhotoReviewCard, ReviewResults
│   ├── layout/           # Header, BottomNav, AppShell, AuthGuard
│   ├── providers/        # ToastProvider
│   ├── stats/            # CollectionProgress
│   └── ui/               # GlassCard, NeoButton, Badge, etc.
├── hooks/                # useWords, useStats, useReview, useKeyboardShortcuts
├── lib/                  # srs.ts, streak.ts, sourceDetector.ts, supabase/
└── types/                # TypeScript interfaces
```

---

Dibuat dengan 💜 buat K-pop fans yang pengen ngerti omongan bias-nya.
