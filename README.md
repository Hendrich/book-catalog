# 📚 Book Catalog API

A secure and production-ready Book Catalog API built with Node.js, Express, PostgreSQL (Supabase), and JWT authentication.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Supabase account & project

### Installation

1. **Clone & Install**

   ```bash
   git clone <repository-url>
   cd book-catalog-app
   npm install
   ```

2. **Environment Setup**

   ```bash
   # Copy environment template
   cp .env.example .env

   # Edit .env with your Supabase credentials
   ```

3. **Database Setup**

   ```bash
   # Run the SQL schema in your Supabase SQL editor
   # File: backend/schema_pg.sql
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📖 API Documentation

### 🌐 Interactive Documentation (Swagger UI)

```
http://localhost:3000/api-docs
```

**Swagger UI provides:**

- Interactive API testing
- Complete endpoint documentation
- Authentication support
- Request/response examples
- Schema validation

### 📋 Alternative Documentation

- **OpenAPI Spec**: `openapi-spec.json`
- **Swagger Guide**: `SWAGGER_UI_GUIDE.md`

## 🔐 Authentication

The API uses JWT authentication via Supabase:

1. **Register**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login`
3. **Use Token**: Include in header: `Authorization: Bearer <token>`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Books Management

- `GET /api/books` - Get all user's books
- `GET /api/books/:id` - Get specific book
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### System

- `GET /health` - Health check
- `GET /api/stats` - API statistics (dev only)

## 🛠️ Development

### Scripts

```bash
npm start          # Production server
npm run dev        # Development with nodemon
npm test           # Run tests
npm run lint       # Code linting
npm run lint:fix   # Fix linting issues
```

### Project Structure

```
book-catalog-app/
├── backend/
│   ├── server.js              # Main server file
│   ├── config/
│   │   └── config.js          # Configuration
│   ├── middlewares/           # Custom middlewares
│   ├── routes/                # API routes
│   └── schema_pg.sql          # Database schema
├── frontend/                  # Frontend files
├── openapi-spec.json          # API documentation
└── docs/                      # Additional documentation
```

## 🔧 Configuration

### Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Database
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

## 🚀 Deployment

### Render.com (Recommended)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Vercel

1. Install Vercel CLI
2. Configure `vercel.json`
3. Deploy with `vercel --prod`

### Other Platforms

- Heroku
- Railway
- DigitalOcean App Platform

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 🧪 Testing

### Manual Testing

1. **Start server**: `npm run dev`
2. **Open Swagger UI**: `http://localhost:3000/api-docs`
3. **Test endpoints interactively**

### Automated Testing

```bash
npm test           # Run all tests
npm run test:watch # Watch mode
```

## 🔒 Security Features

- **Helmet**: Security headers
- **Rate Limiting**: API protection
- **CORS**: Cross-origin configuration
- **Input Validation**: Joi schema validation
- **JWT Authentication**: Secure token-based auth
- **Input Sanitization**: XSS protection

## 📋 TODO & Roadmap

- [ ] User roles and permissions
- [ ] Book categories and tags
- [ ] Search and filtering
- [ ] File upload for book covers
- [ ] API versioning
- [ ] Comprehensive test coverage

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 📞 Support

- **Author**: Hendri Christianto
- **Email**: hendri.christianto24@gmail.com
- **Documentation**: Check `SWAGGER_UI_GUIDE.md`
- **Issues**: Create GitHub issue

---

## 📚 Documentation Files

- `SWAGGER_UI_GUIDE.md` - Swagger UI usage guide
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `OPENAPI_GUIDE.md` - OpenAPI specification guide
- `PROJECT_SUMMARY.md` - Project overview
- `IMPLEMENTATION_CHECKLIST.md` - Development checklist

---

**Happy coding! 🚀**
