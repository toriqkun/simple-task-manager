# Task Manager Application

## Deskripsi Singkat Project
**Task Manager** adalah aplikasi *fullstack* berbasis web yang dirancang untuk membantu pengguna mengelola, melacak, dan merencanakan tugas-tugas harian mereka (Todo-List) secara produktif. 
Aplikasi ini mendukung fungsionalitas registrasi pengguna, otentikasi aman melalui fitur Cookie lintas domain (*Cross-Domain Cookies*), serta penyesuaian zona waktu yang cerdas dan terpelajar untuk menampilkan jadwal di halaman pengguna (*Frontend*). Secara struktural, *Backend* aplikasi ini mengimplementasikan konsep ketat **Repository Pattern** untuk pemisahan logika, menjadikannya modern dan siap menghadapi penambahan skala aplikasi *(Scalable)* pada waktu mendatang.

---

## Tech Stack

### Frontend
- **Framework:** React + TypeScript (via Vite)
- **Styling:** Tailwind CSS v4
- **Routing & State:** React Router DOM, React Context 
- **Icons:** Lucide React
- **HTTP Client:** Axios (With interceptors & credentials configuration)
- **Deployment:** Netlify

### Backend
- **Environment:** Node.js + Express.js
- **Language:** TypeScript
- **Architecture:** Controller-Service-Repository Pattern
- **Authentication:** JSON Web Tokens (JWT) + Cookies (Strict/None Secure) + bcryptjs
- **Deployment:** Render

### Database
- **Platform:** NeonDB (Serverless PostgreSQL)
- **ORM:** Prisma Client v7

---

## Cara Install & Run

### Prasyarat:
Pastikan Anda sudah menginstal alat-alat dasar berikut di laptop/komputer Anda:
- [Node.js](https://nodejs.org/) (Versi 18 atau ke atas)
- [Git](https://git-scm.com/)
- Command Line Interface (CLI/Terminal)

### 1. Proses Kloning (*Clone* Repository)
Buka terminal Anda, lantas eksekusi perintah di bawah ini:
```bash
git clone https://github.com/toriqkun/simple-task-manager.git
cd simple-task-manager
```

### 2. Konfigurasi Backend
1. Masuk ke direktori *backend*:
   ```bash
   cd backend
   ```
2. Lakukan instalasi semua *dependencies* pustaka:
   ```bash
   npm install
   ```
3. Duplikat file lingkungan yang telah disediakan:
   - Salin file `.env.example` yang ada di *root project* ke dalam folder `backend/`.
   - Ganti namanya menjadi `.env`, lalu isi konfigurasinya sesuai informasi koneksi database Anda (Lihat panduan bab Setup Database di bawah).
4. Persiapkan skema *Database* (Prisma Migrations):
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
5. Mulai Server REST API di *Mode Development*:
   ```bash
   npm run dev
   ```

### 3. Konfigurasi Frontend
1. Buka sebuah jendela terminal *baru* lalu navigasikan ke folder *frontend*:
   ```bash
   cd frontend
   ```
2. Instal semua modul yang dibutuhkan situs:
   ```bash
   npm install
   ```
3. Buat file `.env` di dalam root `/frontend` lalu tempelkan teks berikut:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Jalankan Server Frontend (Vite):
   ```bash
   npm run dev
   ```
Aplikasi kini dapat Anda buka di peramban web kesayangan pada halaman URL `http://localhost:5173`.

---

## Cara Setup Database

Data aplikasi berpusat pada *NeonDB*, platform *PostgreSQL cloud*. Anda dimohon untuk mengikuti panduan esensial di bawah ini:
1. Buat akun lalu login ke dasbor kontrol [Neon.tech](https://neon.tech/).
2. Melalui laman utama, klik **"New Project"** dan beri nama basis data Anda.
3. Setelah projek basis data rampung, navigasikan ke *Dashboard* project tersebut dan cari menu opsi *Connection Details*.
4. Pastikan Anda mengkopi utuh tautan referensi **"Connection String"** yang tersedia dengan format kira-kira mirip: `postgresql://[user]:[password]@[host]/[dbname]?sslmode=require`.
5. Sisipkan tautan utuh tersebut ke dalam file `backend/.env` Anda pada variabel `DATABASE_URL`.

---

## Cara Test API di Postman

Proyek ini sudah menyertakan file **Postman Collection** siap pakai di dalam folder `backend/`:

```
backend/Task_Manager_API.postman_collection.json
```

### Langkah-langkah:
1. Buka aplikasi [Postman](https://www.postman.com/downloads/) (Desktop atau Web).
2. Klik tombol **Import** di pojok kiri atas.
3. Pilih tab **File**, lalu *drag & drop* atau *browse* file:
   ```
   backend/Task_Manager_API.postman_collection.json
   ```
4. Setelah berhasil diimpor, Anda akan melihat collection **Task Manager API** di sidebar kiri beserta seluruh endpoint yang tersedia.
5. Pastikan backend server Anda sudah berjalan (`npm run dev` di folder `backend/`).
6. Atur **Base URL** di Postman sesuai server yang ingin diuji:
   - Lokal: `http://localhost:5000`
   - Production (Render): `https://simple-task-manager-ymtb.onrender.com`

### Tips Penting untuk Postman:
- **Cookie otomatis:** Setelah Anda menjalankan request `POST /users/login`, Postman akan secara otomatis menyimpan cookie `token` dari response. Cookie ini akan dikirim pada setiap request berikutnya, sehingga endpoint yang memerlukan autentikasi (seperti `/tasks/my-tasks`, `POST /tasks`, dll.) dapat langsung diakses tanpa konfigurasi tambahan.
- **Urutan testing yang disarankan:**
  1. `POST /users` — Register akun baru
  2. `POST /users/login` — Login untuk mendapatkan cookie token
  3. `GET /tasks/my-tasks` — Ambil daftar tugas
  4. `POST /tasks` — Buat tugas baru
  5. `PUT /tasks/:id` — Update tugas
  6. `DELETE /tasks/:id` — Hapus tugas

---

## Dokumentasi API Endpoints (beserta contoh Payload Data)

Aplikasi memiliki serangkaian operasi komunikasi API yang dipandu lewat *HTTP response status*: `200` (OK) atau `201` (Tercipta), beserta kode malfungsi standar `4xx/5xx`. 

> **Catatan Penting Otentikasi:** Mulut API (*Endpoint*) yang diatur di dalam klaster "Tugas / Task" mensyaratkan token otentikasi JWT yang valid. Token tersebut selalu ditanamkan secara otomatis setiap kali Anda Login (di Header Cookies HTTP dengan sebutan *token*). 

### 1. Kompartemen Akses (Autentikasi & User)

#### [POST] `/users` (Registrasi Akun)
Digunakan untuk mendaftarkan akun perdana pengguna.
- **Request Body (JSON):**
  ```json
  {
    "name": "Jane Developer",
    "email": "jane@email.com",
    "password": "strongPassword#1"
  }
  ```
- **Response Success (201 Created):**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": 1,
      "name": "Jane Developer",
      "email": "jane@email.com"
    }
  }
  ```

#### [POST] `/users/login` (Masuk Akun)
Memverifikasi data surel lalu menanamkan Cookie login.
- **Request Body (JSON):**
  ```json
  {
    "email": "jane@email.com",
    "password": "strongPassword#1"
  }
  ```
- **Response Success (200 OK):**
  *(Browser bakal otomatis mengantongi kredensial HttpOnly Cookies)*
  ```json
  {
    "user": {
      "id": 1,
      "name": "Jane Developer",
      "email": "jane@email.com"
    }
  }
  ```

#### [PUT] `/users/:id` (Perbarui Data Diri)
Melakukan revisi informasi profil. Anda hanya bisa mengubah profil Anda sendiri!
- **Request Body (JSON):**
  ```json
  {
    "name": "Jane Updated Name"
  }
  ```

### 2. Manajemen Aktivitas (Tasks Endpoints)

#### [GET] `/tasks/my-tasks` (Ambil Daftar Tugas Saya)
Secara otomatis akan mengidentifikasi "Siapa penanyanya" dari identitas cookie, lalu mengirim deretan *Todo list* miliknya yang telah disulap format Date-nya ke UTC/WIB.
- **Response Success (200 OK):**
  ```json
  [
    {
      "id": 15,
      "title": "Membaca Buku",
      "description": "Buku arsitektur Repository Pattern bab demi bab.",
      "completed": false,
      "userId": 1,
      "createdAt": "2026-03-14T11:42:53.072Z",
      "updatedAt": "2026-03-14T11:42:53.072Z"
    }
  ]
  ```

#### [POST] `/tasks` (Membuat Tugas Baru)
- **Request Body (JSON):**
  ```json
  {
    "title": "Beli Bahan Dapur Tambahan",
    "description": "Susu, Tepung Ayam, Keju.",
    "completed": false
  }
  ```
- **Response Success (201 Created):**
  ```json
  {
    "id": 16,
    "title": "Beli Bahan Dapur Tambahan",
    "description": "Susu, Tepung Ayam, Keju.",
    "completed": false,
    "userId": 1,
    "createdAt": "2026-03-14T20:00:00.000Z",
    "updatedAt": "2026-03-14T20:00:00.000Z"
  }
  ```

#### [PUT] `/tasks/:id` (Memperbarui status / mengubah detail Data Tugas)
Sangat berguna untuk operasi pencentangan *Checkbox* (*Toggle complete/uncomplete*) di Dashboard atau mengganti narasi pekerjaan.
- **Request Body (Sifatnya Bebas, bisa seluruhnya atau Sebagian Field Saja):**
  ```json
  {
    "completed": true
  }
  ```

#### [DELETE] `/tasks/:id` (Hapus Tugas)
Menghapus permanen *Todo List* tertentu.
- **Response Success (200 OK):**
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```
