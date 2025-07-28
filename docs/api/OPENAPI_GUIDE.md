# OpenAPI Specification Guide - Book Catalog App

## 📁 Single Source of Truth

**File**: `openapi-spec.json`
**Format**: OpenAPI 3.0.3 Specification
**Status**: ✅ Updated dan Valid

---

## 🎯 Mengapa Menggunakan OpenAPI Spec?

### ✅ **Keunggulan OpenAPI:**

1. **Universal Import** - Bisa di-import ke Postman, Insomnia, Thunder Client, dll
2. **Auto Documentation** - Generate dokumentasi API otomatis
3. **Code Generation** - Bisa generate client SDK
4. **Industry Standard** - Format standar industri
5. **Validation** - Schema validation untuk request/response
6. **Mock Server** - Bisa generate mock server untuk testing

### ❌ **File yang Dihapus:**

- `Book_Catalog_API.postman_collection.json` (JSON error & redundant)

---

## 🚀 Cara Import ke Postman

### Method 1: Direct Import

1. Buka Postman
2. Click **Import** button
3. Pilih **File** tab
4. Upload file `openapi-spec.json`
5. Click **Import**

### Method 2: URL Import (jika file di server)

1. Buka Postman
2. Click **Import**
3. Pilih **Link** tab
4. Paste URL: `https://raw.githubusercontent.com/[username]/book-catalog-app/main/openapi-spec.json`

---

## 🔧 Setup Environment di Postman

Setelah import, buat Environment Variables:

```
baseUrl: https://book-catalog-app-z8p8.onrender.com
authToken: (akan di-set setelah login)
```

---

## 📋 Testing Workflow

### 1. **Health Check**

```
GET {{baseUrl}}/health
```

### 2. **Register User**

```
POST {{baseUrl}}/api/auth/register
Content-Type: application/json

{
  "email": "hendri.christianto24@gmail.com",
  "password": "OQS4iqyWkAdBXgsS"
}
```

### 3. **Login User**

```
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "hendri.christianto24@gmail.com",
  "password": "OQS4iqyWkAdBXgsS"
}
```

**Copy token dari response untuk step berikutnya**

### 4. **Get User Info**

```
GET {{baseUrl}}/api/auth/me
Authorization: Bearer {{authToken}}
```

### 5. **Get All Books**

```
GET {{baseUrl}}/api/books
Authorization: Bearer {{authToken}}
```

### 6. **Add New Book**

```
POST {{baseUrl}}/api/books
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
  "title": "Atomic Habits",
  "author": "James Clear"
}
```

### 7. **Update Book**

```
PUT {{baseUrl}}/api/books/{id}
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
  "title": "Atomic Habits - Updated Edition",
  "author": "James Clear"
}
```

### 8. **Delete Book**

```
DELETE {{baseUrl}}/api/books/{id}
Authorization: Bearer {{authToken}}
```

---

## 🛠 Tools yang Support OpenAPI

### **Testing Tools:**

- ✅ Postman
- ✅ Insomnia
- ✅ Thunder Client (VS Code)
- ✅ REST Client (VS Code)
- ✅ curl (command line)

### **Documentation Tools:**

- ✅ Swagger UI
- ✅ Redoc
- ✅ Stoplight Studio

### **Code Generation:**

- ✅ OpenAPI Generator
- ✅ Swagger Codegen
- ✅ Postman Code Generator

---

## 📖 View Documentation

### Online Swagger UI:

1. Copy isi file `openapi-spec.json`
2. Buka: https://editor.swagger.io/
3. Paste JSON content
4. View interactive documentation

### Local Documentation:

```bash
npx @apidevtools/swagger-ui-cli -f openapi-spec.json
```

---

## 🔍 API Endpoints Summary

| Method | Endpoint                 | Description   | Auth Required |
| ------ | ------------------------ | ------------- | ------------- |
| GET    | `/health`                | Health check  | ❌            |
| POST   | `/api/auth/register`     | Register user | ❌            |
| POST   | `/api/auth/login`        | Login user    | ❌            |
| GET    | `/api/auth/me`           | Get user info | ✅            |
| POST   | `/api/auth/verify-token` | Verify token  | ✅            |
| GET    | `/api/books`             | Get all books | ✅            |
| POST   | `/api/books`             | Add new book  | ✅            |
| PUT    | `/api/books/{id}`        | Update book   | ✅            |
| DELETE | `/api/books/{id}`        | Delete book   | ✅            |

---

## 🎯 Quick Start Commands

### PowerShell Testing:

```powershell
# Health Check
Invoke-WebRequest -Uri "https://book-catalog-app-z8p8.onrender.com/health"

# Login
$body = '{"email":"hendri.christianto24@gmail.com","password":"OQS4iqyWkAdBXgsS"}'
$response = Invoke-WebRequest -Uri "https://book-catalog-app-z8p8.onrender.com/api/auth/login" -Method POST -ContentType "application/json" -Body $body
$token = ($response.Content | ConvertFrom-Json).data.token

# Get Books
Invoke-WebRequest -Uri "https://book-catalog-app-z8p8.onrender.com/api/books" -Headers @{Authorization="Bearer $token"}
```

---

## 📝 Expected Response Format

### Successful Response:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    /* response data */
  },
  "timestamp": "2025-07-06T04:28:17.852Z"
}
```

### Error Response:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  },
  "timestamp": "2025-07-06T04:28:17.852Z"
}
```

---

## 🔄 Future Updates

Untuk update API specification:

1. Edit file `openapi-spec.json`
2. Validate menggunakan: https://editor.swagger.io/
3. Re-import ke Postman jika ada perubahan major
4. Update dokumentasi

---

## ✨ Summary

✅ **One File, Multiple Uses** - OpenAPI spec untuk semua kebutuhan
✅ **No Redundancy** - Tidak ada file collection yang duplikat
✅ **Industry Standard** - Format yang diakui industri
✅ **Future Proof** - Support tools modern dan masa depan

**File yang perlu digunakan**: `openapi-spec.json` aja! 🎉
