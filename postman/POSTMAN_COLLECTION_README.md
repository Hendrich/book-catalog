# 📚 Book Catalog API - Postman Collection

Koleksi Postman yang lengkap untuk testing Book Catalog API dengan autentikasi Supabase dan operasi CRUD buku.

## 🚀 Quick Start

### 1. Import Collection & Environment

1. Import `Modul 4 - Assignment 8 - Hendri Christianto.json` ke Postman
2. Import `Book-Catalog-Environment.postman_environment.json` sebagai environment
3. Pilih environment "Book Catalog Environment" di Postman

### 2. Setup Environment Variables

Environment variables sudah di-setup otomatis, tapi Anda bisa modify jika perlu:

- `BASE_URL`: URL production server (default: production Render URL)
- `BASE_URL_LOCAL`: URL development server (http://localhost:3000)
- `SUPABASE_URL`: URL Supabase project
- `SUPABASE_ANON_KEY`: Supabase anonymous key

## 📁 Collection Structure

### 🔐 Authentication

- **Register User (Supabase)** - Daftar user baru
- **Login User (Supabase)** - Login dan dapatkan access token
- **Refresh Token (Supabase)** - Refresh access token yang expired

### 📚 Books Management

- **Get All Books** - Ambil semua buku milik user
- **Add New Book** - Tambah buku baru
- **Update Book** - Edit buku yang sudah ada
- **Delete Book** - Hapus buku

### 🧪 Test Scenarios

- **Test Unauthorized Access** - Test akses tanpa token
- **Test Invalid Book Creation** - Test validasi input
- **Test Update Non-existent Book** - Test error handling

### 🔄 Complete Workflow

End-to-end testing workflow:

1. Login
2. Get Books List
3. Create New Book
4. Update Created Book
5. Delete Created Book

## ✨ Features

### 🤖 Auto-Generated Test Scripts

Setiap request dilengkapi dengan test scripts yang:

- ✅ Memvalidasi status code response
- ✅ Memvalidasi struktur response
- ✅ Otomatis menyimpan access token setelah login
- ✅ Otomatis menyimpan book IDs untuk testing
- ✅ Memberikan feedback yang jelas di console

### 🔄 Token Management

- Auto-save access token setelah login
- Auto-populate Bearer token di semua protected endpoints
- Support refresh token untuk token renewal

### 📊 Variable Management

Collection menggunakan variables untuk:

- `{{access_token}}` - JWT token dari Supabase
- `{{BASE_URL}}` - Base URL server
- `{{SUPABASE_URL}}` - Supabase project URL
- `{{book_id}}` - ID buku untuk testing
- `{{new_book_id}}` - ID buku yang baru dibuat

## 🎯 How to Use

### Basic Testing Flow:

1. **Run "Login User (Supabase)"** - untuk mendapatkan access token
2. **Run "Get All Books"** - untuk melihat buku yang ada
3. **Run "Add New Book"** - untuk menambah buku baru
4. **Run "Update Book"** - untuk edit buku
5. **Run "Delete Book"** - untuk hapus buku

### Complete Workflow Testing:

1. Buka folder "🔄 Complete Workflow"
2. Run requests secara berurutan (1 → 2 → 3 → 4 → 5)
3. Lihat hasil testing di Console tab

### Error Testing:

1. Buka folder "🧪 Test Scenarios"
2. Run requests untuk test berbagai error cases
3. Validasi bahwa API mengembalikan error yang sesuai

## 🛠️ Advanced Usage

### Switch Environment

- Production: Set `BASE_URL` ke production URL
- Local Development: Change `BASE_URL` ke `{{BASE_URL_LOCAL}}`

### Custom Test User

Ubah credentials di environment variables:

- `test_email` - Email untuk testing register
- `test_password` - Password untuk testing

### Batch Testing

1. Pilih folder yang ingin ditest
2. Klik "Run" di Postman
3. Jalankan semua requests dalam folder sekaligus

## 📝 Test Results

Setiap request akan menampilkan:

- ✅ Status code validation
- ✅ Response structure validation
- ✅ Business logic validation
- 📝 Console logs untuk debugging

Example console output:

```
✅ Access token saved: eyJhbGciOiJIUzI1NiIsInR...
📖 First book ID saved: 14
📘 New book created with ID: 25
✅ Step 1: Login successful
🎉 Complete workflow finished!
```

## 🚀 Ready-to-Use Examples

Collection ini sudah include:

- ✅ Real working examples dengan data yang valid
- ✅ Proper error handling tests
- ✅ Complete end-to-end workflow
- ✅ Automated token management
- ✅ Comprehensive test coverage

## 🔧 Troubleshooting

### Token Issues

- Pastikan login dulu sebelum akses protected endpoints
- Check console untuk pesan "Access token saved"
- Jika token expired, run "Refresh Token" atau login ulang

### Environment Issues

- Pastikan environment "Book Catalog Environment" sudah dipilih
- Check bahwa `BASE_URL` dan `SUPABASE_URL` sudah benar
- Variables dengan `{{}}` harus resolved (tidak tampil merah)

### API Issues

- Check bahwa server API sedang running
- Untuk local testing, pastikan server jalan di localhost:3000
- Check network connectivity untuk production server

---

#
# Postman Collection V2
#
# This folder contains Postman collections and environments for testing the Book Catalog API.
#
# ## Files
#
# - `Book_Catalog_API_v2.postman_collection.json` - Main API collection with all endpoints
# - `Book-Catalog-Environment.postman_environment.json` - Environment variables for different setups
# - `POSTMAN_COLLECTION_GUIDE.md` - Detailed guide on using the Postman collection
# - `POSTMAN_COLLECTION_README.md` - Additional documentation for the collection
#
# ## How to Use
#
# 1. Import the collection file into Postman
# 2. Import the environment file
# 3. Select the appropriate environment
# 4. Start testing the API endpoints
#
# ## Environment Variables
#
# Make sure to configure the following variables in your environment:
# - `baseUrl` - The base URL of your API server
# - `authToken` - Authentication token (if required)

🎉 **Happy Testing!** Collection ini siap untuk production testing dan development workflow.
