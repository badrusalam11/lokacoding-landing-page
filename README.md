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
├── docker-compose.yml               # db + api + web (+ caddy opsional, profile "standalone")
├── docker-compose.shared-proxy.yml  # overlay: sambungkan api/web ke Docker network reverse proxy lain
├── Caddyfile                         # konfigurasi Caddy bawaan (Skenario A saja)
└── .env.example                       # env vars untuk docker-compose (root)
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

Cara ini menjalankan database, API, dan frontend (di-build jadi static & di-serve nginx) sekaligus lewat Docker — persis seperti environment produksi. `db`, `api`, dan `web` **tidak** publish port ke semua interface; `api` dan `web` cuma bisa diakses lewat `127.0.0.1` di port yang dikonfigurasi (`RESELLER_API_PORT`, default `4010`, dan `RESELLER_WEB_PORT`, default `3010`) — supaya aman dipasang berdampingan dengan aplikasi lain di VPS yang sama.

```bash
cp .env.example .env
```

Isi `.env` di root:

```env
RESELLER_DOMAIN=reseller.lokacoding.com
POSTGRES_USER=postgres
POSTGRES_PASSWORD=ganti-password-ini
POSTGRES_DB=lokacoding_reseller
JWT_SECRET=ganti-dengan-string-acak-yang-panjang
ADMIN_EMAIL=admin@lokacoding.com
ADMIN_PASSWORD=ganti-password-ini
ADMIN_NAME=Loka Coding Admin
RESELLER_API_PORT=4010
RESELLER_WEB_PORT=3010
```

Build & jalankan **tanpa** reverse proxy bawaan (default — dipakai kalau VPS sudah punya reverse proxy lain, atau untuk testing lokal):

```bash
docker compose up -d --build
curl http://127.0.0.1:4010/api/health   # cek backend
curl -I http://127.0.0.1:3010           # cek frontend
```

Kalau mau sekalian pakai reverse proxy Caddy bawaan repo ini (lihat [bagian 4, Skenario A](#skenario-a--vps-masih-kosong-belum-ada-reverse-proxy-lain)), tambahkan `--profile standalone`:

```bash
docker compose --profile standalone up -d --build
```

Migrasi database dan seed admin **otomatis jalan** setiap kali container `api` start.

Perintah berguna lainnya:

```bash
docker compose logs -f api      # lihat log backend
docker compose down             # stop semua service (data database tetap ada)
docker compose down -v          # stop + hapus semua data (database ikut kehapus)
```

---

## 4. Deploy ke Production (VPS)

Ada dua skenario tergantung kondisi VPS-nya.

### Skenario A — VPS masih kosong (belum ada reverse proxy lain)

1. Pastikan Docker & Docker Compose sudah terpasang di VPS.
2. Arahkan DNS **A record** `reseller.lokacoding.com` ke IP VPS.
3. Pastikan port **80** dan **443** terbuka di firewall VPS.
4. Clone repo ini ke VPS (pakai nama folder yang beda dari project lain, mis. `lokacoding-reseller`), buat file `.env` di root (lihat bagian [3](#3-menjalankan-full-stack-via-docker-compose)) dengan `RESELLER_DOMAIN=reseller.lokacoding.com` dan **secret/password yang benar-benar aman**.
5. Jalankan dengan profile `standalone` supaya Caddy bawaan repo ini yang pegang port 80/443:
   ```bash
   docker compose --profile standalone up -d --build
   ```
6. Caddy otomatis mengurus sertifikat HTTPS (Let's Encrypt) untuk domain tersebut.

### Skenario B — VPS sudah ada reverse proxy lain (mis. sudah ada project lain seperti `lokasee` yang pegang port 80/443)

**Jangan** pakai profile `standalone` di sini — port 80/443 sudah dipegang container lain, kalau dipaksa jalan akan gagal start (`port is already allocated`). Caddy bawaan repo ini **tidak perlu dijalankan sama sekali**; cukup numpang di reverse proxy yang sudah ada.

> **Penting:** reverse proxy yang sudah ada (mis. `lokasee-caddy`) itu jalan di containernya sendiri. Kalau dia proxy ke container lain lewat `reverse_proxy backend:4000` (nama container, bukan `127.0.0.1:port`), itu tandanya dia reach container lain lewat **Docker network**, bukan port host — `127.0.0.1` di dalam container Caddy itu cuma merujuk ke dirinya sendiri, bukan ke VPS. Makanya kita perlu menyambungkan container `api`/`web` kita ke Docker network yang sama dengan Caddy yang sudah ada, lalu reverensi mereka pakai **nama container**, sama seperti pola yang sudah dipakai Caddyfile itu.

1. Clone repo ini ke folder terpisah, mis. `~/lokacoding-reseller` (compose project sudah diberi nama unik `lokacoding-reseller`, dan container `api`/`web` sudah dikasih nama eksplisit `lokacoding-reseller-api` / `lokacoding-reseller-web` — tidak akan bentrok dengan container project lain).
2. Cari nama Docker network yang dipakai reverse proxy yang sudah ada:
   ```bash
   docker inspect lokasee-caddy --format '{{json .NetworkSettings.Networks}}'
   ```
   Ambil nama network-nya dari output itu (contoh umumnya `lokasee_default`, tapi cek langsung — bisa beda tergantung nama project/compose file mereka).
3. Buat `.env` seperti biasa (lihat bagian [3](#3-menjalankan-full-stack-via-docker-compose)), tambahkan satu baris:
   ```env
   SHARED_PROXY_NETWORK=<nama-network-dari-langkah-2>
   ```
4. Jalankan pakai overlay `docker-compose.shared-proxy.yml` (ini yang menyambungkan `api`/`web` ke network tadi):
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.shared-proxy.yml up -d --build
   ```
5. Tambahkan site block baru ke Caddyfile **yang sudah ada**, pakai nama container (bukan `127.0.0.1`):
   ```caddyfile
   reseller.lokacoding.com {
     handle /api/* {
       reverse_proxy lokacoding-reseller-api:4000
     }
     handle {
       reverse_proxy lokacoding-reseller-web:80
     }
   }
   ```
   Cari lokasi file Caddyfile itu di host (bukan di dalam container), mis.:
   ```bash
   docker inspect lokasee-caddy --format '{{json .Mounts}}'
   ```
   lalu edit file itu dan tambahkan block di atas.
6. Reload reverse proxy yang sudah ada supaya konfigurasi baru terbaca (untuk Caddy, tanpa downtime, tidak mengganggu domain lain yang sudah jalan):
   ```bash
   docker exec lokasee-caddy caddy reload --config /etc/caddy/Caddyfile
   ```

> Kalau reverse proxy yang sudah ada bukan Caddy (mis. nginx) tapi tetap satu Docker network dengan container lain, prinsipnya sama: tambahkan `server` block baru untuk `reseller.lokacoding.com` yang mem-proxy `/api/*` ke `lokacoding-reseller-api:4000` dan sisanya ke `lokacoding-reseller-web:80` — asal nginx-nya juga sudah disambungkan ke network yang sama.
>
> `RESELLER_API_PORT`/`RESELLER_WEB_PORT` (default `127.0.0.1:4010`/`127.0.0.1:3010`) tetap aktif di skenario ini — berguna untuk `curl` langsung dari VPS host buat debugging, tapi bukan itu yang dipakai reverse proxy untuk reach container kita.

Landing page utama (`index.html`) **tidak perlu langkah tambahan** di kedua skenario — sudah otomatis ter-deploy ke GitHub Pages lewat workflow yang ada, dan tombol "Join Reseller" di sana sudah mengarah ke `https://reseller.lokacoding.com`.

### Update / redeploy

```bash
git pull
docker compose up -d --build                       # Skenario B (tanpa profile)
docker compose --profile standalone up -d --build  # Skenario A (dengan Caddy bawaan)
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
| `RESELLER_DOMAIN` | domain yang dipakai Caddy **bawaan** repo ini (hanya relevan kalau pakai `--profile standalone`, Skenario A) |
| `RESELLER_API_PORT` / `RESELLER_WEB_PORT` | port loopback (`127.0.0.1`) tempat `api`/`web` di-publish, default `4010`/`3010` — buat debugging langsung dari VPS host, bukan jalur yang dipakai reverse proxy (Skenario B) |
| `SHARED_PROXY_NETWORK` | **hanya dipakai bareng `docker-compose.shared-proxy.yml`** (Skenario B) — nama Docker network milik reverse proxy yang sudah ada, supaya dia bisa reach `api`/`web` kita lewat nama container |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | kredensial database di container `db` |
| `JWT_SECRET` | sama fungsinya seperti di `server/.env` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | sama fungsinya seperti di `server/.env` |

---

## Troubleshooting

- **`prisma migrate dev` gagal connect** → pastikan container/service PostgreSQL sudah jalan dan `DATABASE_URL` di `server/.env` sesuai (host, port, user, password, nama database).
- **Login admin gagal setelah `docker compose up`** → cek log dengan `docker compose logs api`, pastikan `ADMIN_EMAIL`/`ADMIN_PASSWORD` di `.env` root sudah terisi sebelum container pertama kali start (seed hanya membuat/update user berdasarkan env saat itu).
- **Frontend tidak bisa fetch API (CORS error) saat development** → pastikan `CORS_ORIGIN` di `server/.env` sesuai dengan URL tempat frontend jalan (default `http://localhost:5173`).
- **`docker compose --profile standalone up` gagal dengan "port is already allocated"** → sudah ada service lain (mis. project lain) yang pegang port 80/443 di VPS itu. Jangan pakai profile `standalone` — ikuti Skenario B di bagian [Deploy ke Production](#4-deploy-ke-production-vps), numpang di reverse proxy yang sudah ada.
