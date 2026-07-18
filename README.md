# Loka Coding — Landing Page & Reseller Platform

Repo ini berisi dua bagian yang independen:

1. **Landing page utama** ([index.html](index.html)) — company profile statis, di-deploy otomatis ke GitHub Pages lewat [.github/workflows](.github/workflows) setiap push ke `main`. Tidak butuh instalasi apa pun untuk dikembangkan, cukup buka filenya di browser.
2. **Platform Reseller** (`/server` + `/reseller-app`) — aplikasi full-stack terpisah (landing skema reseller, registrasi, dan dashboard) yang di-deploy ke domain sendiri (`reseller.lokacoding.com`), lihat panduan lengkap di bawah.

---

## Struktur Repo

```
.
├── index.html            # landing page utama (GitHub Pages)
├── templates.html        # katalog template
├── templates/             # demo template statis
├── server/                # backend API — Express + TypeScript + Prisma + PostgreSQL
├── reseller-app/          # frontend platform reseller — React + Vite + Tailwind
├── docker-compose.yml     # orkestrasi db + api + web + reverse proxy (Caddy)
├── Caddyfile               # konfigurasi reverse proxy & auto-HTTPS
└── .env.example             # env vars untuk docker-compose (root)
```

---

## Prasyarat

| Tool | Versi | Keterangan |
|---|---|---|
| [Node.js](https://nodejs.org) | 22+ | untuk menjalankan backend & frontend |
| npm | bawaan Node | package manager |
| [PostgreSQL](https://www.postgresql.org) | 16+ | bisa native atau lewat Docker |
| [Docker](https://www.docker.com/products/docker-desktop) + Docker Compose | terbaru | wajib untuk menjalankan full-stack via `docker compose`, dan untuk deploy ke VPS |

Landing page utama (`index.html`) tidak butuh prasyarat apa pun — HTML/CSS/JS murni.

---

## 1. Menjalankan Landing Page Utama

Tidak ada proses build. Buka `index.html` langsung di browser, atau pakai extension semacam **Live Server** (VS Code) untuk auto-reload. Perubahan pada file ini otomatis ter-deploy ke GitHub Pages saat di-push ke branch `main`.

---

## 2. Menjalankan Platform Reseller (Mode Development)

Mode ini menjalankan backend & frontend langsung dengan `npm run dev` (hot-reload), cocok untuk development sehari-hari.

### 2.1 Siapkan Database

Pilih salah satu:

**Opsi A — Docker (disarankan, tidak perlu install PostgreSQL):**
```bash
docker run -d --name lokacoding-reseller-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=lokacoding_reseller \
  -p 5432:5432 \
  postgres:16-alpine
```

**Opsi B — PostgreSQL yang sudah terinstall lokal:**
Buat database baru bernama `lokacoding_reseller` dan catat user/password-nya.

### 2.2 Setup & Jalankan Backend (`/server`)

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` sesuai environment kamu:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lokacoding_reseller?schema=public"
JWT_SECRET="ganti-dengan-string-acak-yang-panjang"
PORT=4000
CORS_ORIGIN="http://localhost:5173"

# akun admin pertama, dibuat otomatis oleh seed script
ADMIN_EMAIL="admin@lokacoding.com"
ADMIN_PASSWORD="ganti-password-ini"
ADMIN_NAME="Loka Coding Admin"
```

Jalankan migrasi database & buat akun admin pertama:

```bash
npx prisma migrate dev --name init   # buat tabel di database
npm run seed                          # buat akun admin dari ADMIN_EMAIL/ADMIN_PASSWORD di .env
```

Jalankan server API:

```bash
npm run dev
```

API akan jalan di **http://localhost:4000**. Cek dengan `curl http://localhost:4000/api/health` → harus mengembalikan `{"ok":true}`.

### 2.3 Setup & Jalankan Frontend (`/reseller-app`)

Buka terminal baru:

```bash
cd reseller-app
npm install
cp .env.example .env
```

Isi `reseller-app/.env`:

```env
VITE_API_URL=http://localhost:4000
```

Jalankan dev server:

```bash
npm run dev
```

Frontend akan jalan di **http://localhost:5173**.

### 2.4 Alur Testing

1. Buka `http://localhost:5173` → halaman penjelasan skema reseller.
2. Klik **"Daftar sebagai Reseller"** → isi form → otomatis masuk ke dashboard reseller.
3. Di dashboard reseller: klik **"+ Propose Project"**, isi data klien, submit.
4. Logout, lalu login pakai akun admin (`ADMIN_EMAIL`/`ADMIN_PASSWORD` dari `.env` backend) → dashboard admin menampilkan semua project dari semua reseller, dengan dropdown untuk mengubah status.

---

## 3. Menjalankan Full-Stack via Docker Compose

Cara ini menjalankan database, API, frontend (di-build jadi static & di-serve nginx), dan reverse proxy Caddy sekaligus — persis seperti environment produksi. Cocok untuk verifikasi sebelum deploy, atau langsung dipakai di VPS.

```bash
cp .env.example .env
```

Isi `.env` di root:

```env
RESELLER_DOMAIN=reseller.lokacoding.com   # atau ":80" untuk testing lokal tanpa HTTPS
POSTGRES_USER=postgres
POSTGRES_PASSWORD=ganti-password-ini
POSTGRES_DB=lokacoding_reseller
JWT_SECRET=ganti-dengan-string-acak-yang-panjang
ADMIN_EMAIL=admin@lokacoding.com
ADMIN_PASSWORD=ganti-password-ini
ADMIN_NAME=Loka Coding Admin
```

> Untuk testing lokal (tanpa domain publik), set `RESELLER_DOMAIN=:80` — Caddy akan serve HTTP biasa di `localhost` tanpa mencoba minta sertifikat HTTPS.

Build & jalankan semua service:

```bash
docker compose up -d --build
```

Migrasi database dan seed admin **otomatis jalan** setiap kali container `api` start. Akses aplikasi di `http://localhost` (jika pakai `RESELLER_DOMAIN=:80`) atau `https://reseller.lokacoding.com` (jika domain sudah diarahkan).

Perintah berguna lainnya:

```bash
docker compose logs -f api      # lihat log backend
docker compose down             # stop semua service (data database tetap ada)
docker compose down -v          # stop + hapus semua data (database ikut kehapus)
```

---

## 4. Deploy ke Production (VPS)

1. Pastikan Docker & Docker Compose sudah terpasang di VPS.
2. Arahkan DNS **A record** `reseller.lokacoding.com` ke IP VPS.
3. Pastikan port **80** dan **443** terbuka di firewall VPS.
4. Clone repo ini ke VPS, buat file `.env` di root (lihat bagian [3](#3-menjalankan-full-stack-via-docker-compose) di atas) dengan `RESELLER_DOMAIN=reseller.lokacoding.com` dan **secret/password yang benar-benar aman** (jangan pakai nilai contoh).
5. Jalankan:
   ```bash
   docker compose up -d --build
   ```
6. Caddy otomatis mengurus sertifikat HTTPS (Let's Encrypt) untuk domain tersebut — tidak perlu setup manual.

Landing page utama (`index.html`) **tidak perlu langkah tambahan** — sudah otomatis ter-deploy ke GitHub Pages lewat workflow yang ada, dan tombol "Join Reseller" di sana sudah mengarah ke `https://reseller.lokacoding.com`.

### Update / redeploy

```bash
git pull
docker compose up -d --build
```

---

## Skema Role

| Role | Bisa apa |
|---|---|
| **RESELLER** | Daftar akun sendiri lewat halaman `/register`, mengajukan project baru (`Propose Project`), melihat status project miliknya (read-only) |
| **ADMIN** | Melihat semua project dari semua reseller, **mengubah status project** (`PENDING` → `REVIEWED` → `IN_PROGRESS` → `COMPLETED`/`REJECTED`). Akun admin **tidak bisa didaftar sendiri** — dibuat lewat seed script (`ADMIN_EMAIL`/`ADMIN_PASSWORD` di env) |

---

## Referensi Environment Variables

### `server/.env`
| Variabel | Keterangan |
|---|---|
| `DATABASE_URL` | connection string PostgreSQL |
| `JWT_SECRET` | secret untuk sign token login, wajib string acak & panjang |
| `PORT` | port API, default `4000` |
| `CORS_ORIGIN` | origin frontend yang diizinkan akses API |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | dipakai `npm run seed` untuk membuat akun admin pertama |

### `reseller-app/.env`
| Variabel | Keterangan |
|---|---|
| `VITE_API_URL` | base URL backend API. Kosongkan (atau hapus) saat build untuk production — frontend otomatis pakai path relatif `/api/...` yang di-proxy Caddy |

### `.env` (root, untuk `docker-compose.yml`)
| Variabel | Keterangan |
|---|---|
| `RESELLER_DOMAIN` | domain yang dipakai Caddy, mis. `reseller.lokacoding.com`, atau `:80` untuk testing lokal |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | kredensial database di container `db` |
| `JWT_SECRET` | sama fungsinya seperti di `server/.env` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | sama fungsinya seperti di `server/.env` |

---

## Troubleshooting

- **`prisma migrate dev` gagal connect** → pastikan container/service PostgreSQL sudah jalan dan `DATABASE_URL` di `server/.env` sesuai (host, port, user, password, nama database).
- **Login admin gagal setelah `docker compose up`** → cek log dengan `docker compose logs api`, pastikan `ADMIN_EMAIL`/`ADMIN_PASSWORD` di `.env` root sudah terisi sebelum container pertama kali start (seed hanya membuat/update user berdasarkan env saat itu).
- **Frontend tidak bisa fetch API (CORS error) saat development** → pastikan `CORS_ORIGIN` di `server/.env` sesuai dengan URL tempat frontend jalan (default `http://localhost:5173`).
