# 📚 Book Catalog API - Enhanced Version

This is a **production-ready** Book Catalog API built with Node.js and Express, featuring comprehensive security, validation, error handling, and best practices implementation.

---

## ✨ New Features & Improvements

### 🔒 Security Enhancements

- **Helmet.js** security headers
- **Rate limiting** for API protection
- **Input validation** with Joi
- **Request sanitization**
- **Security logging** for sensitive operations

### 🛡️ Error Handling

- **Centralized error handling** middleware
- **Consistent error responses**
- **Graceful error recovery**
- **Development vs Production error details**

### � Performance & Monitoring

- **Request logging** with performance metrics
- **API statistics** endpoint
- **Health check** endpoint
- **Graceful shutdown** handling

### 🧪 Code Quality

- **Modular architecture**
- **Environment-based configuration**
- **Input validation** middleware
- **Enhanced frontend architecture**

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variables

```bash
# Copy template and configure
cp .env.template .env
# Edit .env with your values
```

### 3. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

---

## 🌍 API Endpoints

### 🔍 Health & Monitoring

```http
GET /health              # Health check
GET /api/stats           # API statistics (dev only)
```

### 🔐 Authentication (Supabase)

```http
POST /api/auth/register  # User registration info
POST /api/auth/login     # User login info
POST /api/auth/logout    # User logout info
GET /api/auth/me         # Current user info
POST /api/auth/verify-token # Token verification
```

### 📘 Books (Protected Routes)

```http
GET /api/books           # Get all user's books (with pagination)
GET /api/books/:id       # Get specific book
POST /api/books          # Add new book
PUT /api/books/:id       # Update book
DELETE /api/books/:id    # Delete book
```

---

## 🔐 Authentication Flow

The API uses **Supabase Authentication** with **JWT Bearer Tokens**.

### Registration & Login (Client-side)

```javascript
// Register
const { error } = await supabase.auth.signUp({ email, password });

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// Use token in API requests
const token = data.session.access_token;
```

### API Request Headers

```http
Authorization: Bearer <supabase_access_token>
Content-Type: application/json
```

---

## � API Request/Response Examples

### Add a Book

```http
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Atomic Habits",
  "author": "James Clear"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Atomic Habits",
    "author": "James Clear",
    "user_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "message": "Book added successfully",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Get Books with Pagination

```http
GET /api/books?page=1&limit=10&search=atomic
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "Validation Error: Title is required",
    "code": "VALIDATION_ERROR"
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "path": "/api/books",
  "method": "POST"
}
```

---

## �️ Security Features

### Rate Limiting

- **API Endpoints**: 100 requests per 15 minutes
- **Auth Endpoints**: 5 attempts per 15 minutes
- **Sensitive Operations**: 3 attempts per hour

### Input Validation

- **Title**: 1-255 characters, required
- **Author**: 1-255 characters, required
- **Email**: Valid email format
- **Password**: Minimum 6 characters

### Security Headers

- Content Security Policy
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security (HTTPS)

---

## 📁 Project Structure

```
book-catalog-app/
├── backend/
│   ├── config/
│   │   └── config.js              # Environment configuration
│   ├── middlewares/
│   │   ├── authMiddleware.js       # JWT authentication
│   │   ├── errorHandler.js        # Centralized error handling
│   │   ├── logger.js              # Request logging
│   │   ├── rateLimiter.js         # Rate limiting
│   │   └── validation.js          # Input validation
│   ├── routes/
│   │   ├── authRoutes.js          # Authentication endpoints
│   │   └── bookRoutes.js          # Book CRUD operations
│   ├── db.js                      # Database connection
│   └── server.js                  # Main application server
├── frontend/
│   ├── js/
│   │   ├── components/
│   │   │   └── notifications.js    # Notification system
│   │   ├── services/
│   │   │   └── apiService.js       # HTTP client
│   │   └── config.js              # Frontend configuration
│   ├── index.html                 # Main HTML
│   ├── script.js                  # Application logic
│   └── styles.css                 # Styling
├── .env.template                  # Environment variables template
├── openapi-spec.json              # API documentation
├── PRD-Book-Catalog-App.md        # Product Requirements Document
├── IMPLEMENTATION_CHECKLIST.md    # Development checklist
├── CODE_ANALYSIS_RECOMMENDATIONS.md # Code analysis & improvements
├── DEPLOYMENT_GUIDE.md            # Deployment instructions
└── package.json                   # Dependencies & scripts
```

---

## 🧪 Testing & Quality

### API Testing

- **Postman Collection**: Complete test suite included
- **Environment Variables**: Pre-configured for testing
- **Automated Tests**: Test scripts for critical flows

### Code Quality

- **ESLint**: Code linting and formatting
- **Input Validation**: Comprehensive validation with Joi
- **Error Handling**: Consistent error responses
- **Security Audit**: Regular dependency scanning

---

## 📚 Documentation

### Available Documentation

- **[API Documentation](./openapi-spec.json)**: OpenAPI 3.0 specification
- **[Postman Collection](./POSTMAN_COLLECTION_README.md)**: Testing guide
- **[PRD](./PRD-Book-Catalog-App.md)**: Product Requirements Document
- **[Implementation Checklist](./IMPLEMENTATION_CHECKLIST.md)**: Development guide
- **[Code Analysis](./CODE_ANALYSIS_RECOMMENDATIONS.md)**: Code improvements
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)**: Production deployment

### Quick Links

- **Health Check**: `/health`
- **API Stats**: `/api/stats` (development only)
- **OpenAPI Spec**: `/api-docs` (if enabled)

---

## 🌐 Deployment

### Supported Platforms

- **Render.com** (recommended) - Auto-deploy configured
- **Heroku** - Ready for deployment
- **Vercel** - Serverless functions support

### Environment Variables Required

```env
PORT=3000
NODE_ENV=production
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
FRONTEND_URL=your_frontend_url
```

### Production URLs

- **Backend API**: https://book-catalog-app-z8p8.onrender.com
- **Health Check**: https://book-catalog-app-z8p8.onrender.com/health

---

## 👨‍💻 Tech Stack

### Backend

- **Runtime**: Node.js >= 18.0
- **Framework**: Express.js
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth + JWT
- **Validation**: Joi
- **Security**: Helmet, Rate Limiting

### Frontend

- **Core**: HTML5, CSS3, Vanilla JavaScript
- **HTTP Client**: Fetch API with retry logic
- **Notifications**: Custom notification system
- **State Management**: Centralized auth service

### DevOps & Tools

- **Package Manager**: npm
- **Environment**: dotenv
- **API Documentation**: OpenAPI 3.0
- **Testing**: Postman Collection
- **Deployment**: Render.com, Docker ready

---

## � Support & Contributing

### Getting Help

1. Check the **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** for setup issues
2. Review **[Implementation Checklist](./IMPLEMENTATION_CHECKLIST.md)** for development
3. Use health endpoint `/health` to verify system status
4. Check application logs for error details

### Development

```bash
# Install development dependencies
npm install --include=dev

# Run development server with auto-restart
npm run dev

# Run linting
npm run lint

# Run tests (when available)
npm test
```

---

## 📈 Performance & Monitoring

### Built-in Monitoring

- **Request Logging**: Detailed request/response logging
- **Performance Metrics**: Response time tracking
- **API Statistics**: Usage analytics in development
- **Health Checks**: System status monitoring

### Production Considerations

- **Rate Limiting**: Prevents API abuse
- **Error Handling**: Graceful error recovery
- **Security Headers**: Comprehensive security setup
- **Graceful Shutdown**: Proper server shutdown handling

---

## � Version History

### v1.0 (Enhanced) - Current

- ✅ Complete security hardening
- ✅ Comprehensive error handling
- ✅ Input validation & sanitization
- ✅ Performance monitoring
- ✅ Enhanced frontend architecture
- ✅ Production-ready deployment

### v0.1 (Initial)

- ✅ Basic CRUD operations
- ✅ Supabase authentication
- ✅ Frontend integration

---

**Built by**: Hendri Christianto  
**License**: MIT  
**Last Updated**: 2024  
**Status**: Production Ready
