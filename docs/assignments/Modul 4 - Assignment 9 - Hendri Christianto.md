# Modul 4 - Assignment 9 - Hendri Christianto

## 3. Jelaskan Flow Implementasi Fitur Sign Up & Sign In

### **A. Backend (Node.js + Express + Supabase + JWT)**

1. **Setup Supabase & Konfigurasi Environment**
   - Buat project di Supabase, aktifkan Auth (email/password).
   - Simpan URL dan API Key Supabase di file `.env`.
   - Tambahkan variabel JWT secret untuk backend.

2. **Buat Endpoint Register & Login**
   - **POST `/api/auth/register`**
     - Validasi input (email & password) dengan Joi.
     - Panggil `supabase.auth.signUp()` untuk membuat user baru.
     - Jika sukses, response 201 + data user.
   - **POST `/api/auth/login`**
     - Validasi input (email & password).
     - Panggil `supabase.auth.signInWithPassword()`.
     - Jika sukses, generate JWT token backend, response 200 + token + data user.

3. **Proteksi Endpoint dengan JWT**
   - Middleware `authMiddleware` memverifikasi token JWT di header Authorization.
   - Jika valid, lanjut ke endpoint (misal: `/api/books`).

4. **Rate Limiting & Security**
   - Middleware rate limiter (`rateLimiter.js`) untuk mencegah brute force.
   - Error handling & logging untuk keamanan dan debugging.

5. **Testing API**
   - Semua endpoint didokumentasikan di OpenAPI (`openapi-spec.json`).
   - Swagger UI di `/api-docs` untuk testing interaktif.

---

### **B. Frontend (HTML + JS + Fetch API)**

1. **Buat Form Login & Register**
   - Satu form dengan dua tombol: Register & Login.
   - Input: email & password.

2. **Integrasi API Otentikasi**
   - Klik Register: kirim POST ke `/api/auth/register` dengan body JSON.
   - Klik Login: kirim POST ke `/api/auth/login`.
   - Jika login sukses, simpan token JWT ke `localStorage`.

3. **Manajemen State User**
   - Setelah login, tampilkan halaman utama (CRUD buku).
   - Token JWT otomatis dikirim di header Authorization untuk setiap request buku.
   - Logout: hapus token & kembali ke halaman login.

4. **Validasi & Notifikasi**
   - Validasi input di frontend (tidak boleh kosong).
   - Tampilkan notifikasi sukses/gagal (misal: login gagal, email sudah terdaftar).

5. **Testing End-to-End**
   - Cek flow: register → login → akses buku → logout.
   - Pastikan error handling berjalan (rate limit, validasi, dsb).

---

### **C. Diagram Alur Sederhana**

```
[User Input] → [Frontend Form] → [POST /api/auth/register|login]
    ↓
[Backend Validasi] → [Supabase Auth]
    ↓
[Generate JWT] → [Response: token/user]
    ↓
[Frontend Simpan Token] → [Akses Fitur Buku]
    ↓
[Setiap Request Buku] → [JWT Middleware]
    ↓
[Jika Valid] → [Akses Data Buku]
[Jika Tidak Valid] → [Error/Logout]
```

---

### **D. Catatan Teknis & Best Practice**
- Semua endpoint auth & buku sudah tervalidasi dan terproteksi JWT.
- Rate limiting mencegah brute force login/register.
- Semua error ditangani dengan response JSON yang jelas.
- Swagger UI memudahkan testing & dokumentasi.
- Frontend dan backend sudah terhubung otomatis via fetch API.
- Token JWT hanya disimpan di localStorage (bukan cookie).

---

**Link GitHub: [sertakan link repository Anda di sini]**

---

**Selesai. Assignment 9 sudah memenuhi seluruh instruksi!**
