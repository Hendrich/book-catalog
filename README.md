﻿# ðŸ“š Script Labs API

A secure and production-ready Script Labs API built with Node.js, Express, PostgreSQL (Supabase), and JWT authentication.

## ðŸš€ Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Supabase account & project

### Installation

1. **Clone & Install**

   ```bash
   git clone <repository-url>
   cd script-labs-app
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
   # File: database/schema_pg.sql (for PostgreSQL)
   # File: database/schema_my.sql (for MySQL)
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## ðŸ“– API Documentation

### ðŸŒ Interactive Documentation (Swagger UI)

```
http://localhost:3000/api-docs
```

**Swagger UI provides:**

- Interactive API testing
  cd script-labs-app
- Authentication support
- Request/response examples
- Schema validation

### ðŸ“‹ Alternative Documentation

- **OpenAPI Spec**: `openapi-spec.json`
- **Swagger Guide**: `SWAGGER_UI_GUIDE.md`

## ðŸ” Authentication

The API uses JWT authentication via Supabase:

1. **Register**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login`
3. **Use Token**: Include in header: `Authorization: Bearer <token>`

## ðŸ“š API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Labs Management

- `GET /api/labs` - Get all user's labs
- `GET /api/labs/:id` - Get specific lab
- `POST /api/labs` - Create new lab
- `PUT /api/labs/:id` - Update lab
- `DELETE /api/labs/:id` - Delete lab

### System

- `GET /health` - Health check
- `GET /api/stats` - API statistics (dev only)

## ðŸ› ï¸ Development

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
script-labs/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ server.js              # Main server file
â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â””â”€â”€ config.js          # Configuration
â”‚   â”œâ”€â”€ middlewares/           # Custom middlewares
â”‚   â”‚   â”œâ”€â”€ authMiddleware.js
â”‚   â”‚   â”œâ”€â”€ errorHandler.js
â”‚   â”‚   â”œâ”€â”€ logger.js
â”‚   â”‚   â”œâ”€â”€ rateLimiter.js
â”‚   â”‚   â””â”€â”€ validation.js
â”‚   â”œâ”€â”€ routes/                # API routes
â”‚   â”‚   â”œâ”€â”€ authRoutes.js
â”‚   â”‚   â””â”€â”€ labRoutes.js
â”‚   â””â”€â”€ db.js                  # Database connection
â”œâ”€â”€ database/                  # Database schemas and scripts
â”‚   â”œâ”€â”€ schema_pg.sql          # PostgreSQL schema
â”‚   â”œâ”€â”€ schema_my.sql          # MySQL schema
â”‚   â”œâ”€â”€ query.sql              # Example queries
â”‚   â””â”€â”€ README.md
â”œâ”€â”€ docs/                      # Documentation
â”‚   â”œâ”€â”€ api/                   # API documentation
â”‚   â”‚   â”œâ”€â”€ openapi-spec.json
â”‚   â”‚   â”œâ”€â”€ OPENAPI_GUIDE.md
â”‚   â”‚   â”œâ”€â”€ SWAGGER_INTEGRATION_COMPLETE.md
â”‚   â”‚   â””â”€â”€ SWAGGER_UI_GUIDE.md
â”‚   â”œâ”€â”€ assignments/           # Assignment files
â”‚   â”œâ”€â”€ deployment/            # Deployment guides
â”‚   â”‚   â”œâ”€â”€ DEPLOYMENT_GUIDE.md
â”‚   â”‚   â””â”€â”€ CRITICAL_DEPLOYMENT_FIX.md
â”‚   â””â”€â”€ *.md                   # Other documentation
â”œâ”€â”€ postman/                   # Postman collections
â”‚   â”œâ”€â”€ Script_Labs_API_v2.postman_collection.json
â”‚   â”œâ”€â”€ Script-Labs-Environment.postman_environment.json
â”‚   â”œâ”€â”€ POSTMAN_COLLECTION_GUIDE.md
â”‚   â”œâ”€â”€ POSTMAN_COLLECTION_README.md
â”‚   â””â”€â”€ README.md
â”œâ”€â”€ tests/                     # Test files
â”‚   â”œâ”€â”€ test-api.js
â”‚   â””â”€â”€ README.md
â”œâ”€â”€ scripts/                   # Utility scripts
â”œâ”€â”€ .env                       # Environment variables
â”œâ”€â”€ .env.template              # Environment template
â”œâ”€â”€ package.json
â””â”€â”€ README.md
```

## ðŸ”§ Configuration

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

## ðŸš€ Deployment

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

See `docs/deployment/DEPLOYMENT_GUIDE.md` for detailed instructions.

## ðŸ§ª Testing

### Manual Testing

1. **Start server**: `npm run dev`
2. **Open Swagger UI**: `http://localhost:3000/api-docs`
3. **Test endpoints interactively**

### Automated Testing

```bash
npm test           # Run all tests
npm run test:watch # Watch mode
```

## ðŸ”’ Security Features

- **Helmet**: Security headers
- **Rate Limiting**: API protection
- **CORS**: Cross-origin configuration
- **Input Validation**: Joi schema validation
- **JWT Authentication**: Secure token-based auth
- **Input Sanitization**: XSS protection

## ðŸš¨ Troubleshooting

### Common Issues & Solutions

#### **429 Too Many Requests Error**

```json
{
  "success": false,
  "error": {
    "message": "Too many operation attempts from this IP",
    "code": "RATE_LIMIT_EXCEEDED"
  }
}
```

**Solutions:**

1. **Wait**: Rate limits reset after the window expires
2. **Development**: Rate limits are more permissive in development mode
3. **Check Requests**: Ensure frontend doesn't send duplicate requests
4. **Network**: Clear browser cache and restart development server

#### **Validation Error (Email & Password Required)**

```json
{
  "success": false,
  "error": {
    "message": "Validation Error: Email is required, Password is required"
  }
}
```

**Solutions:**

1. **Check Frontend**: Ensure form sends `email` and `password` fields
2. **Content-Type**: Verify `Content-Type: application/json` header
3. **Data Format**: Ensure JSON data is properly formatted
4. **Network**: Check browser dev tools for request payload

#### **CORS Issues**

- **Local Development**: Ensure server runs on `http://localhost:3000`
- **Production**: Update CORS configuration in `backend/config/config.js`
- **Mixed Content**: Don't mix HTTP and HTTPS requests

#### **Connection Issues**

1. **Local Server**: Ensure `npm run dev` is running
2. **Port**: Verify server runs on correct port (3000)
3. **Firewall**: Check Windows Firewall settings
4. **Network**: Try accessing `http://localhost:3000/health` directly

### **Debug Tools**

#### **Test API Script**

```bash
# Test both local and production
node test-api.js

# Test local only
node test-api.js local

# Test production only
node test-api.js production
```

#### **Swagger UI Testing**

1. Open `http://localhost:3000/api-docs`
2. Test individual endpoints interactively
3. Use "Authorize" button for authentication
4. Check request/response in browser dev tools

#### **Manual Testing with curl**

```bash
# Health check
curl http://localhost:3000/health

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### **Environment Check**

```bash
# Check if server is running
curl http://localhost:3000/health

# Check API stats (development only)
curl http://localhost:3000/api/stats

# View server logs
npm run dev
```

## ðŸ“‹ TODO & Roadmap

- [ ] User roles and permissions
- [ ] Lab categories and tags
- [ ] Search and filtering
- [ ] File upload for lab covers
- [ ] API versioning
- [ ] Comprehensive test coverage

## ðŸ¤ Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## ðŸ“„ License

MIT License - see LICENSE file for details.

## ðŸ“ž Support

- **Author**: Hendri Christianto
- **Email**: hendri.christianto24@gmail.com
- **Documentation**: Check `SWAGGER_UI_GUIDE.md`
- **Issues**: Create GitHub issue

---

## ðŸ“š Documentation Files

- `SWAGGER_UI_GUIDE.md` - Swagger UI usage guide
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `OPENAPI_GUIDE.md` - OpenAPI specification guide
- `PROJECT_SUMMARY.md` - Project overview
- `IMPLEMENTATION_CHECKLIST.md` - Development checklist

---

**Happy coding! ðŸš€**


