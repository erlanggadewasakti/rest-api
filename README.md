# 🎓 Mahasiswa RESTful API (NestJS + Prisma 7 ORM + JWT + Swagger)

RESTful API data mahasiswa yang dibangun menggunakan **NestJS**, **Prisma 7 ORM (dengan Driver Adapter MariaDB/MySQL)**, **JWT Authentication**, dan dokumentasi interaktif **Swagger UI**. Dilengkapi fitur auto-run **Prisma Studio** untuk keperluan demonstrasi bahan ajar langsung, serta siap di-deploy ke **aaPanel**.

---

## 🌟 Fitur Utama

- **Prisma 7 ORM Architecture**:
  - Konfigurasi terpusat di `prisma.config.ts`.
  - Menggunakan JavaScript Driver Adapter `@prisma/adapter-mariadb` & `mariadb` untuk performa andal dan fleksibel.
  - Model data `User` dan `Mahasiswa` dengan migrasi & seeding otomatis.
- **RESTful CRUD**: Endpoint lengkap `GET`, `GET /:id`, `POST`, `PUT /:id` (full update), dan `DELETE /:id`.
- **Autentikasi JWT**: Endpoint `POST /auth/login` menghasilkan Bearer Token dengan enkripsi `bcryptjs`.
- **Public & Protected Endpoints**: Mendukung rute publik (tanpa JWT) dan rute terlindungi (membutuhkan JWT).
- **Swagger Documentation**: Dokumentasi interaktif lengkap di `/docs` dengan fitur Authorize JWT.
- **Simultaneous Dev Run**: Menjalankan NestJS API (port 3000) dan Prisma Studio (port 5555) secara bersamaan dalam 1 perintah.
- **aaPanel Ready**: Konfigurasi `ecosystem.config.cjs` (PM2) dan panduan deployment lengkap [AAPANEL_DEPLOYMENT.md](AAPANEL_DEPLOYMENT.md).

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
Sesuaikan konfigurasi database MySQL pada file `.env`:
```env
DATABASE_URL="mysql://root:root@localhost:3306/db_mahasiswa"
PORT=3000
STUDIO_PORT=5555
JWT_SECRET="rahasiadong123_super_secret_jwt_key_2026"
```

### 2. Generate Prisma 7 Client & Migrasi Database
```bash
# Generate Prisma 7 client
bun run prisma:generate

# Push schema ke database
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

## 🚢 Deployment ke aaPanel

Silakan ikuti panduan lengkap di [AAPANEL_DEPLOYMENT.md](AAPANEL_DEPLOYMENT.md) untuk langkah-langkah:
1. Setup MySQL di aaPanel
2. Konfigurasi Node.js project manager & PM2
3. Setup domain, Nginx reverse proxy, dan SSL Let's Encrypt.
