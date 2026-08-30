# 🚀 Panduan Deployment Mahasiswa RESTful API di aaPanel (PostgreSQL + Prisma 7)

Panduan lengkap ini menjelaskan langkah demi langkah cara men-deploy aplikasi NestJS RESTful API dengan **Prisma 7 ORM**, **Driver Adapter PostgreSQL (`@prisma/adapter-pg`)**, dan database **PostgreSQL** di server **aaPanel**.

---

## 📋 Prasyarat di aaPanel

Pastikan modul/fitur berikut sudah terinstal di App Store aaPanel:
1. **Nginx** (Web Server & Reverse Proxy)
2. **PostgreSQL Manager / PostgreSQL** (Database Server PostgreSQL)
3. **Node.js Version Manager** (Pilih Node.js LTS v20.x atau v22.x / v24.x)
4. **PM2 Manager** (Opsional)

---

## 🛠️ Langkah 1: Setup PostgreSQL di aaPanel & Buat Database

1. Buka dashboard aaPanel lalu masuk ke menu **App Store**.
2. Cari dan install **PostgreSQL Manager** (atau PostgreSQL).
3. Setelah terinstal, buka **PostgreSQL Manager**:
   - Atur password user `postgres` (contoh: `PasswordPostgres123!`).
   - Buat database baru:
     - **Database Name**: `rest_api`
     - **Username**: `postgres` (atau buat user baru)
     - **Password**: `PasswordPostgres123!`
4. Format `DATABASE_URL` Anda menjadi:
   ```env
   postgresql://postgres:PasswordPostgres123!@127.0.0.1:5432/rest_api?schema=public
   ```

---

## 📂 Langkah 2: Upload Kode Proyek ke Server

Buka menu **Terminal** di aaPanel:
```bash
cd /www/wwwroot
git clone <URL_REPOSITORY_ANDA> rest-api
cd rest-api
```

---

## ⚙️ Langkah 3: Konfigurasi Environment (`.env`)

1. Di dalam direktori `/www/wwwroot/rest-api`, buat/edit file `.env`:
   ```bash
   cp .env.example .env
   ```
2. Sesuaikan isinya:
   ```env
   # Database PostgreSQL aaPanel
   DATABASE_URL="postgresql://postgres:PasswordPostgres123!@127.0.0.1:5432/rest_api?schema=public"

   # Konfigurasi Port
   PORT=3000
   STUDIO_PORT=5555

   # JWT Secret Key
   JWT_SECRET="rahasiadong123_super_secret_jwt_key_2026"
   JWT_EXPIRES_IN="1d"
   ```

---

## 📦 Langkah 4: Install Dependencies & Migrasi Database

Di **Terminal** aaPanel pada direktori `/www/wwwroot/rest-api`:

1. **Install dependencies**:
   ```bash
   npm install
   # atau jika ada bun:
   # bun install
   ```

2. **Generate Prisma 7 Client**:
   ```bash
   npx prisma generate
   ```

3. **Sinkronisasi Skema ke Database PostgreSQL (Migrate / Push)**:
   ```bash
   npx prisma db push
   ```

4. **Isi Data Awal (Dummy Login & Mahasiswa)**:
   ```bash
   npx prisma db seed
   ```

5. **Build Aplikasi**:
   ```bash
   npm run build
   ```

---

## 🌐 Langkah 5: Setup Node Project di aaPanel

Buat 2 project di tab **Website** -> **Node project**:

### 1. Main API Service (Port 3000)
- **Project Name**: `rest_api`
- **Run Opt**: `start:prod [node dist/main.js]` *(atau Run File: `dist/main.js`)*
- **Project Path**: `/www/wwwroot/rest-api`
- **Project Port**: `3000`
- **Node.js Version**: `v20.x` / `v22.x` / `v24.x`
- **Boot**: Centang

### 2. Prisma Studio Service (Port 5555 - Bahan Ajar)
- **Project Name**: `rest_api_studio`
- **Run Opt**: `studio [prisma studio --port 5555 --browser none]`
- **Project Path**: `/www/wwwroot/rest-api`
- **Project Port**: `5555`
- **Node.js Version**: `v20.x` / `v22.x` / `v24.x`

---

## 🔒 Langkah 6: Konfigurasi Domain & Reverse Proxy Nginx

1. **Untuk API** (`api.domainanda.com` -> Port 3000):
   - Pasang domain di Node project `rest_api` dan aktifkan SSL Let's Encrypt.
2. **Untuk Prisma Studio** (`api-studio.domainanda.com` -> Port 5555):
   - Pasang domain di Node project `rest_api_studio` dan aktifkan SSL Let's Encrypt.
   - Pastikan Reverse Proxy mengarah ke `http://127.0.0.1:5555` dengan WebSocket header:
     ```nginx
     location / {
         proxy_pass http://127.0.0.1:5555;
         proxy_set_header Host $host;
         proxy_set_header X-Real-IP $remote_addr;
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection "upgrade";
     }
     ```

---

## 🧪 Langkah 7: Akses & Verifikasi

- **Swagger Documentation**: `https://api.domainanda.com/docs`
- **Prisma Studio**: `https://api-studio.domainanda.com/` *(seluruh tabel `users` & `mahasiswa` langsung muncul tanpa error)*
- **Login Dummy**:
  - Username: `admin`
  - Password: `rahasiadong123`
