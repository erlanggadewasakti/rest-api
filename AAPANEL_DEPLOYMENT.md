# 🚀 Panduan Deployment Mahasiswa RESTful API di aaPanel (Prisma 7 Ready)

Panduan lengkap ini menjelaskan langkah demi langkah cara men-deploy aplikasi NestJS RESTful API dengan **Prisma 7 ORM**, **Driver Adapter MariaDB/MySQL**, dan database MySQL di server **aaPanel**.

---

## 📋 Prasyarat di aaPanel

Pastikan modul/fitur berikut sudah terinstal di App Store aaPanel:
1. **Nginx** (atau Apache / OpenLiteSpeed)
2. **MySQL** (atau MariaDB versi 10.x / MySQL 8.x)
3. **Node.js Version Manager** (pilih Node.js LTS v20.x atau v22.x)
4. **PM2 Manager** (opsional jika menggunakan Node project manager bawaan aaPanel)

---

## 🛠️ Langkah 1: Buat Database MySQL di aaPanel

1. Buka dashboard aaPanel lalu klik menu **Databases** di sidebar kiri.
2. Klik tombol **Add Database**.
3. Masukkan detail database:
   - **DBName**: `db_mahasiswa`
   - **DBUser**: `user_mahasiswa` (atau sesuaikan)
   - **Password**: Buat password yang kuat (contoh: `PasswordDB123!`)
   - **Access Permission**: `Localhost` (atau `Everyone` jika diakses dari remote IP)
4. Klik **Submit**.

Catatan format `DATABASE_URL` Anda akan menjadi:
```env
mysql://user_mahasiswa:PasswordDB123!@localhost:3306/db_mahasiswa
```

---

## 📂 Langkah 2: Upload Kode Proyek ke Server

Ada 2 cara yang dapat dipilih:

### Opsi A: Menggunakan Git Clone (Direkomendasikan)
1. Buka menu **Terminal** di aaPanel.
2. Masuk ke direktori web:
   ```bash
   cd /www/wwwroot
   git clone <URL_REPOSITORY_ANDA> rest-api
   cd rest-api
   ```

### Opsi B: Menggunakan aaPanel File Manager
1. Kompres proyek Anda menjadi file `.zip` (kecuali folder `node_modules` dan `dist`).
2. Masuk ke menu **Files** di aaPanel, navigasi ke `/www/wwwroot/`.
3. Upload file `.zip` lalu **Extract**.

---

## ⚙️ Langkah 3: Konfigurasi Environment (`.env`)

1. Di dalam direktori proyek `/www/wwwroot/rest-api`, salin atau buat file `.env`:
   ```bash
   cp .env.example .env
   ```
2. Sesuaikan isinya:
   ```env
   # Database MySQL aaPanel
   DATABASE_URL="mysql://user_mahasiswa:PasswordDB123!@localhost:3306/db_mahasiswa"

   # Konfigurasi Aplikasi
   PORT=3000
   STUDIO_PORT=5555

   # JWT Secret Key
   JWT_SECRET="rahasiadong123_super_secret_jwt_key_2026"
   JWT_EXPIRES_IN="1d"
   ```

---

## 📦 Langkah 4: Install Dependencies & Migrasi Database

Buka Terminal di aaPanel (pada direktori proyek `/www/wwwroot/rest-api`):

1. **Install dependencies**:
   ```bash
   npm install
   # atau jika server memiliki bun:
   # bun install
   ```

2. **Generate Prisma 7 Client**:
   ```bash
   npx prisma generate
   ```

3. **Sinkronisasi Skema ke Database (Migrate / Push)**:
   ```bash
   npx prisma db push
   ```

4. **Isi Data Awal (Dummy Login & Mahasiswa)**:
   ```bash
   npx prisma db seed
   ```

5. **Build Aplikasi untuk Produksi**:
   ```bash
   npm run build
   ```
   *File build akan dihasilkan di folder `dist/`.*

---

## 🌐 Langkah 5: Setup Node Project di aaPanel

1. Buka menu **Website** -> tab **Node project** di aaPanel.
2. Klik **Add Node project**.
3. Isi konfigurasi berikut:
   - **Project Name**: `mahasiswa-api`
   - **Run Opt**: `Node` (atau `npm`)
   - **Project Path**: `/www/wwwroot/rest-api`
   - **Run File / Run Script**: `dist/main.js` (atau Start Script: `start:prod`)
   - **Project Port**: `3000`
   - **Node.js Version**: Pilih `Node.js 20.x` atau `22.x`
4. Klik **Submit**.
5. Pastikan status project menunjukkan **Running**.

---

## 🔒 Langkah 6: Konfigurasi Domain & Reverse Proxy Nginx

Agar API bisa diakses melalui domain Anda (misal `api.domainanda.com`):

1. Buka tab **Website** -> **Node project** -> klik **Settings** pada project `mahasiswa-api`.
2. Pada tab **Domain manager**, tambahkan nama domain Anda (misal: `api.domainanda.com`).
3. Pada tab **SSL**, pasang sertifikat SSL gratis dari **Let's Encrypt** lalu klik **Save**.
4. Nginx aaPanel akan otomatis mengatur Reverse Proxy dari port 80/443 ke port internal `3000`.

---

## 🧪 Langkah 7: Pengujian API & Swagger di Server

Setelah berhasil di-deploy, Anda dapat mengakses:
- **Status API**: `https://api.domainanda.com/`
- **Swagger Documentation**: `https://api.domainanda.com/docs`
- **Login Dummy**:
  - URL: `POST https://api.domainanda.com/auth/login`
  - Username: `admin`
  - Password: `rahasiadong123`

---

## 💡 Menjalankan Prisma Studio di Server (Opsional untuk Bahan Ajar)

Jika ingin menampilkan Prisma Studio saat mengajar secara remote:
```bash
npx prisma studio --port 5555 --hostname 0.0.0.0
```
> **Catatan Keamanan**: Buka Port `5555` di menu **Security** firewall aaPanel jika ingin diakses langsung dari IP server `http://IP-SERVER:5555`. Tutup kembali port tersebut setelah sesi kelas selesai untuk menjaga keamanan database.
