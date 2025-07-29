# API Testing Guide - Book Catalog App

## � **UPDATE: Single Source of Truth**

**File yang digunakan**: `openapi-spec.json` (OpenAPI 3.0.3)
**File yang dihapus**: `Book_Catalog_API.postman_collection.json` (redundant & error)

---

## 📥 Import OpenAPI Spec ke Postman

### 1. **Import File:**

- Buka Postman
- Klik "Import" button
- Upload file `openapi-spec.json` dari project root
- Postman akan auto-generate collection dari OpenAPI spec

### 2. **Setup Environment:**

Buat Environment dengan variables:

```
baseUrl: https://book-catalog-app-z8p8.onrender.com
authToken: (akan di-set manual setelah login)
```

---

## 🚀 Testing Workflow

### 1. Health Check

- **Endpoint**: GET `/health`
- **Auth**: None
- **Expected**: Status 200 dengan server info

### 2. Register/Login

- **Register**: POST `/api/auth/register`
- **Login**: POST `/api/auth/login`
- **Body**:

```json
{
  "email": "hendri.christianto24@gmail.com",
  "password": "OQS4iqyWkAdBXgsS"
}
```

- **Action**: Copy `token` dari login response
- **Manual**: Set `authToken` variable di Environment

### 3. Books CRUD

- **Get All**: GET `/api/books` (with Bearer token)
- **Add Book**: POST `/api/books` (with Bearer token)
- **Update**: PUT `/api/books/{id}` (with Bearer token)
- **Delete**: DELETE `/api/books/{id}` (with Bearer token)

---

## 🎯 Keunggulan OpenAPI vs Postman Collection

| Feature               | OpenAPI Spec          | Postman Collection |
| --------------------- | --------------------- | ------------------ |
| **Universal Import**  | ✅ All tools          | ❌ Postman only    |
| **Documentation**     | ✅ Rich & Interactive | ❌ Limited         |
| **Auto Generation**   | ✅ Code & Docs        | ❌ Manual          |
| **Validation**        | ✅ Schema validation  | ❌ Manual scripts  |
| **Industry Standard** | ✅                    | ❌                 |

---

## 📖 Dokumentasi Lengkap

Lihat file: `OPENAPI_GUIDE.md` untuk:

- Setup guide lengkap
- PowerShell testing commands
- Response format examples
- Tool recommendations

---

## 🎉 Quick Start

1. Import `openapi-spec.json` ke Postman
2. Setup Environment variables
3. Test Health endpoint
4. Login dan copy token
5. Set authToken variable
6. Test Books endpoints

**Simple & Effective!** 🚀
