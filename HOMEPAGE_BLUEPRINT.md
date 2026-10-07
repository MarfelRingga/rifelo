# Rifelo Homepage Improvement Blueprint

Blueprint sementara perbaikan antarmuka dan pengalaman pengguna pada `/` (Homepage) sesuai standar Rifelo Design System (`AGENTS.md`) dan halaman referensi `/profile` & `/circle`.

---

## 📋 Task Checklist

- [x] **Poin 1: Penyelarasan Palet Warna & Anti-Slop**
  - [x] Hapus aksen gradasi neon ungu/amethyst (`bg-[#a299af]`, `border-purple-500`, `bg-purple-500`, `radial-gradient #a855f7`).
  - [x] Standarisasi warna aksen ke **Rifelo Gold** (`#d4af37`, `#f3d98b`, `#e2c77d`).
  - [x] Standarisasi latar belakang ke **Deep Black** (`#050505` / `#0c0e0b`), **Dark Espresso** (`#1A1A1A` / `#231712`), dan **Warm Off-White / Sand** (`#F9F8F6`, `#F4F3EE`).
  - [x] Ganti bayangan neon menjadi deep natural shadows (`shadow-[0_4px_20px_rgba(0,0,0,0.5)]` atau `shadow-sm/md`).

- [x] **Poin 2: Skala Tipografi & Kontras Teks (Sesuai Referensi `/profile`)**
  - [x] Tingkatkan kontras subjudul hero (menaikkan dari opacity 30% ke kontras terbaca min 60-70%).
  - [x] Terapkan hierarki tipografi standar: H1 (`text-5xl sm:text-7xl font-bold tracking-tight`), H2 (`text-2xl sm:text-3xl font-bold`), H3 (`text-lg font-bold`), Eyebrow (`text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#d4af37]`).

- [x] **Poin 3: Peningkatan Kualitas Chassis Mockup Smartphone Fisik (Sesuai `/circle` & `/profile`)**
  - [x] Upgrade frame demo di `#circle-demo-section` menjadi Chassis Smartphone Fisik `#0c0d12` 100% sama persis dengan `rounded-[3.4rem]`, bezel tipis, tombol fisik samping, speaker ear-piece, dan status bar iOS.
  - [x] Terapkan browser address bar bar di dalam viewport: `rifelo.id/u/marfel` untuk Dynamic Profile dan `rifelo.id/c/circle` untuk Circle.
  - [x] Tampilkan konten Dynamic Profile 100% sama persis dari `/u/marfel` (menggunakan `PublicProfileView`) dan Circle 100% dari `/c/circle`.

- [x] **Poin 4: Matematika Radius Sudut & Proporsi Tombol (Rifelo Radius System)**
  - [x] Standarisasi tombol navbar dan CTA menjadi `rounded-full` (Pill) dengan padding horizontal minimal 2x vertikal (`px-6 py-3`).
  - [x] Terapkan radius berjenjang: Outer Container `rounded-3xl` (24px) ➔ Inner Container `rounded-2xl` (16px) ➔ Elements `rounded-xl` (12px).

- [x] **Poin 5: Pengalaman Demo Interaktif Dynamic Profile**
  - [x] Hadirkan interaktivitas mini di demo profil (pilihan mode / switch tema / preview live) yang mencerminkan kapabilitas `/profile`.

- [x] **Poin 6: Copywriting & Action Call-to-Action (CTA)**
  - [x] Ganti tombol CTA "Coming Soon" menjadi actionable ("Get Your Wristband" / "Claim Your Identity").
  - [x] Terapkan deteksi auth session pada navbar (menampilkan "Dashboard" jika sudah sign-in, atau "Sign In" / "Get Started" jika belum).

---
*Catatan: File blueprint ini akan dihapus secara otomatis setelah seluruh poin di atas selesai diimplementasikan dan diverifikasi.*
