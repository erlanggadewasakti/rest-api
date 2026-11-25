# 🎓 Mahasiswa RESTful API (NestJS + Prisma 7 ORM PostgreSQL + JWT + Swagger)

RESTful API data mahasiswa yang dibangun menggunakan **NestJS**, **Prisma 7 ORM (PostgreSQL)**, **JWT Authentication**, dan dokumentasi interaktif **Swagger UI**. Dilengkapi fitur auto-run **Prisma Studio** untuk keperluan demonstrasi bahan ajar langsung, **AdminJS Dashboard** (`/admin`), serta siap di-deploy menggunakan **Docker**.

---

## 🌟 Fitur Utama

- **Prisma 7 ORM (PostgreSQL First-Class Support)**:
  - Konfigurasi terpusat di `prisma.config.ts`.
  - Menggunakan JavaScript Driver Adapter `@prisma/adapter-pg` & `pg` untuk performa stabil dan kompatibilitas 100% dengan Prisma Studio.
  - Model data `User` dan `Mahasiswa` dengan migrasi & seeding otomatis.
- **RESTful CRUD**: Endpoint lengkap `GET`, `GET /:id`, `POST`, `PUT /:id` (full update), dan `DELETE /:id`.
- **Autentikasi JWT**: Endpoint `POST /auth/login` menghasilkan Bearer Token dengan enkripsi `bcryptjs`.
- **Public & Protected Endpoints**: Mendukung rute publik (tanpa JWT) dan rute terlindungi (membutuhkan JWT).
- **Swagger Documentation**: Dokumentasi interaktif lengkap di `/docs` dengan fitur Authorize JWT.
- **Simultaneous Dev Run**: Menjalankan NestJS API (port 3000) dan Prisma Studio (port 5555) secara bersamaan dalam 1 perintah.
- **Docker Ready**: Dilengkapi multi-stage [Dockerfile](Dockerfile) untuk deployment produksi dengan PostgreSQL eksternal.

---

## 🔑 Kredensial Dummy Login

Setelah menjalankan seeding database, Anda dapat login menggunakan:
- **Username**: `admin`
- **Password**: `rahasiadong123`

---

## 🚀 Cara Menjalankan Project

### 1. Salin Environment File
```bash
cp .env.example .env
```
Konfigurasi database PostgreSQL pada file `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rest_api?schema=public"
PORT=3000
STUDIO_PORT=5555
JWT_SECRET="rahasiadong123_super_secret_jwt_key_2026"
```

### 2. Generate Prisma 7 Client & Sinkronisasi Database
```bash
# Generate Prisma 7 client
bun run prisma:generate

# Push schema ke database PostgreSQL
bun run prisma:push

# Isi data dummy (admin & sample mahasiswa)
bun run prisma:seed
```

### 3. Jalankan API + Prisma Studio (Simultan)
Untuk keperluan mengajar/demo langsung:
```bash
bun run start:dev
# atau menggunakan npm:
npm run start:dev
```
Perintah di atas akan menjalankan secara bersamaan:
- 🚀 **NestJS API Server**: `http://localhost:3000`
- 📚 **Swagger Documentation**: `http://localhost:3000/docs`
- 🗄️ **Prisma Studio Web UI**: `http://localhost:5555`

---

## 📚 Daftar Endpoint API

### 1. Public Endpoints (Tanpa JWT)
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/` | Status API, info server & panduan endpoint |
| `GET` | `/public/info` | Rekapitulasi statistik data mahasiswa & jurusan |
| `GET` | `/public/mahasiswa` | Preview 5 data mahasiswa teratas |
| `POST` | `/auth/login` | Login user untuk memperoleh JWT Bearer Token |
| `GET` | `/docs` | Halaman interaktif Swagger UI |

### 2. Protected Endpoints (Wajib Header `Authorization: Bearer <token>`)
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/auth/profile` | Melihat profil user yang sedang login |
| `GET` | `/mahasiswa` | Mengambil semua mahasiswa (search, filter, pagination) |
| `GET` | `/mahasiswa/:id` | Mengambil detail mahasiswa berdasarkan ID |
| `POST` | `/mahasiswa` | Menambahkan data mahasiswa baru |
| `PUT` | `/mahasiswa/:id` | Memperbarui seluruh data mahasiswa (HTTP PUT) |
| `DELETE` | `/mahasiswa/:id` | Menghapus data mahasiswa berdasarkan ID |

---

## 📝 Contoh Payload Mahasiswa

### `POST /mahasiswa` & `PUT /mahasiswa/:id`
```json
{
  "nim": "2024004",
  "nama": "Ahmad Fauzi",
  "jurusan": "Teknik Informatika",
  "fakultas": "Ilmu Komputer",
  "angkatan": 2024,
  "email": "ahmad.fauzi@example.com"
}
```

---

## 🚢 Deployment dengan Docker

Pastikan database PostgreSQL eksternal dan file `.env` sudah siap, lalu build dan jalankan container:

```bash
# 1. Build production API image
docker build -t rest-api .

# 2. (Opsional) Jalankan migrasi & seed database via target migrator
docker build --target migrator -t rest-api-migrator .
docker run --rm --env-file .env rest-api-migrator
docker run --rm --env-file .env rest-api-migrator bunx prisma db seed

# 3. Jalankan container API (port 3000)
docker run -d --name rest-api -p 3000:3000 --env-file .env --restart unless-stopped rest-api
```
