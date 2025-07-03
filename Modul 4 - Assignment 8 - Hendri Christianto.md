# 📚 Book Catalog API

This is a secure Book Catalog API built with Node.js and Express, ready for real-world frontend integration and AI coding assistants.

---

## 🚀 How to Run

### 1. Clone the project

```bash
git clone https://github.com/Hendrich/book-catalog-app.git
cd book-catalog-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set environment variables (`.env`)

```env
PORT=3000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_jwt_secret
```

### 4. Start the server

```bash
npm start
```

---

## 🌍 Base URL

```http
http://localhost:3000
```

or your deployed URL:

```http
https://book-catalog-app-z8p8.onrender.com
```

---

## 🔐 Authentication Flow

The API uses **Bearer Token Authentication** via `/api/auth` routes.

### 🔑 Register

```http
POST /api/auth/register
```

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

### 🔑 Login

```http
POST /api/auth/login
```

Returns a **JWT token**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

Use this token in all protected routes:

```
Authorization: Bearer <token>
```

---

## 📘 Book Endpoints (Protected)

All routes below require a Bearer token.

### 📄 Get All Books

```http
GET /api/books
```

### ➕ Add a Book

```http
POST /api/books
```

```json
{
  "title": "Atomic Habits",
  "author": "James Clear"
}
```

### ✏️ Update a Book

```http
PUT /api/books/:id
```

```json
{
  "title": "Atomic Habits Updated",
  "author": "J. Clear"
}
```

### ❌ Delete a Book

```http
DELETE /api/books/:id
```

---

## 🧪 Example Headers for Protected Routes

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI...
Content-Type: application/json
```

---

## 📁 Postman Collection

A complete Postman collection including:

- Register/Login
- Book CRUD with headers and body examples

[👉 Download Postman Collection](./postman_collection.json)

---

## 👨‍💻 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Supabase (optional)
- JWT Auth

---

## 📬 Contact

Built by [Your Name] — [your.email@example.com]
