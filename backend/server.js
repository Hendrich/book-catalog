// server.js - Enhanced with security and middleware improvements
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");

// Import configuration and middleware
const config = require("./config/config");
const { errorHandler } = require("./middlewares/errorHandler");
const { requestLogger, statsLogger } = require("./middlewares/logger");
const { apiLimiter } = require("./middlewares/rateLimiter");
const { sanitize } = require("./middlewares/validation");

// Import routes
const bookRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");

// Load OpenAPI specification
const openApiSpec = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../openapi-spec.json"), "utf8")
);

const app = express();
const session = require("express-session");
const PORT = config.port;

// =============================================================================
// SESSION MIDDLEWARE
// =============================================================================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "bookcatalogsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 10 * 60 * 1000, // 10 menit
      httpOnly: true,
      secure: config.nodeEnv === "production", // hanya https di production
    },
  })
);

// =============================================================================
// SECURITY MIDDLEWARE
// =============================================================================

// Helmet for security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://*.supabase.co"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// =============================================================================
// GENERAL MIDDLEWARE
// =============================================================================

// Request logging (only in development and production, not in test)
if (config.nodeEnv !== "test") {
  app.use(requestLogger);
  app.use(statsLogger);
}

// Rate limiting
// Rate limiting hanya untuk endpoint sensitif, dengan limit sangat longgar
const { createRateLimiter } = require("./middlewares/rateLimiter");

// Limit longgar: 1000 request per 10 menit (600000 ms)
const relaxedLimiter = createRateLimiter(
  600000,
  1000,
  "Too many requests from this IP, please try again later"
);

// Terapkan hanya di endpoint auth dan books
app.use("/api/auth", relaxedLimiter);
app.use("/api/books", relaxedLimiter);

// Body parsing
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Debug log untuk semua request body
app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    console.log(`[DEBUG] ${req.method} ${req.url} body:`, req.body);
  }
  next();
});

// Input sanitization
app.use(sanitize);

// CORS configuration
app.use(cors(config.cors));

// =============================================================================
// API ROUTES
// =============================================================================

// Swagger UI Documentation
const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info { margin: 50px 0; }
    .swagger-ui .info .title { color: #3b82f6; }
  `,
  customSiteTitle: "Book Catalog API Documentation",
  customfavIcon: "/favicon.ico",
};

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, swaggerOptions)
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    nodeEnv: config.nodeEnv,
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// API stats endpoint (only in development)
if (config.nodeEnv === "development") {
  const { getApiStats } = require("./middlewares/logger");
  app.get("/api/stats", (req, res) => {
    res.json({
      success: true,
      data: getApiStats(),
      timestamp: new Date().toISOString(),
    });
  });
}

// =============================================================================
// STATIC FILES & FRONTEND
// =============================================================================

// ...frontend static serving removed. Only API endpoints are served.

// Catch-all handler for non-existent API endpoints
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    res.status(404).json({
      success: false,
      error: {
        message: "API endpoint not found",
        code: "ENDPOINT_NOT_FOUND",
      },
      timestamp: new Date().toISOString(),
    });
  } else {
    // Return a simple text response for non-API routes to avoid frontend misinterpreting HTML as JSON
    res
      .status(404)
      .type("text")
      .send(
        "The page cannot be found on backend. Frontend is served from Vercel."
      );
  }
});

// =============================================================================
// ERROR HANDLING
// =============================================================================

// Global error handling middleware (must be last)
app.use(errorHandler);

// =============================================================================
// SERVER STARTUP
// =============================================================================

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);

  if (config.nodeEnv === "development") {
    console.log(`📊 API Stats: http://localhost:${PORT}/api/stats`);
    console.log(`📚 Frontend: http://localhost:${PORT}`);
  }
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("🔄 SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("✅ HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("🔄 SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("✅ HTTP server closed");
    process.exit(0);
  });
});

module.exports = app;
