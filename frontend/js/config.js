/**
 * Frontend Configuration Management
 * Environment-based configuration for the Book Catalog App
 */

// Environment detection
const environment =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "development"
    : "production";

// Configuration for different environments
const configurations = {
  development: {
    apiBaseUrl: "http://localhost:3000",
    supabaseUrl: "https://uoumouxnuzwioaolnfmw.supabase.co",
    supabaseAnonKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvdW1vdXhudXp3aW9hb2xuZm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NTQxMzUsImV4cCI6MjA2MzEzMDEzNX0.YbL_R0L7HInsvemamaJ_7BXPvwW5zyYvULiqFhXtJdA",
    enableDebugMode: true,
    requestTimeout: 10000, // 10 seconds
  },
  production: {
    apiBaseUrl: "https://book-catalog-app-z8p8.onrender.com",
    supabaseUrl: "https://uoumouxnuzwioaolnfmw.supabase.co",
    supabaseAnonKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvdW1vdXhudXp3aW9hb2xuZm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NTQxMzUsImV4cCI6MjA2MzEzMDEzNX0.YbL_R0L7HInsvemamaJ_7BXPvwW5zyYvULiqFhXtJdA",
    enableDebugMode: false,
    requestTimeout: 15000, // 15 seconds
  },
};

// Get current configuration
const appConfig = configurations[environment];

// Add environment info
appConfig.environment = environment;
appConfig.version = "1.0.0";

// Constants
appConfig.constants = {
  DEFAULT_BOOK_IMAGE: "/image/default-book.jpg",
  MAX_TITLE_LENGTH: 255,
  MAX_AUTHOR_LENGTH: 255,
  PAGINATION_LIMIT: 10,
  RETRY_ATTEMPTS: 3,
  DEBOUNCE_DELAY: 300, // milliseconds
};

// UI Messages
appConfig.messages = {
  success: {
    bookAdded: "Book added successfully!",
    bookUpdated: "Book updated successfully!",
    bookDeleted: "Book deleted successfully!",
    loginSuccess: "Login successful!",
    logoutSuccess: "Logged out successfully!",
    registrationSuccess:
      "Registration successful! Please check your email for confirmation.",
  },
  error: {
    networkError: "Network error. Please check your connection.",
    unauthorized: "Session expired. Please log in again.",
    validationError: "Please fill in all required fields.",
    bookNotFound: "Book not found.",
    genericError: "Something went wrong. Please try again.",
    loginFailed: "Login failed. Please check your credentials.",
    registrationFailed: "Registration failed. Please try again.",
  },
  validation: {
    titleRequired: "Book title is required",
    authorRequired: "Author name is required",
    emailRequired: "Email is required",
    passwordRequired: "Password is required",
    emailInvalid: "Please enter a valid email address",
    passwordTooShort: "Password must be at least 6 characters long",
  },
};

// Validation patterns
appConfig.validation = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  minPasswordLength: 6,
};

// Debug logging (only in development)
if (appConfig.enableDebugMode) {
  console.log("📊 App Configuration:", appConfig);
  console.log("🌍 Environment:", environment);
}

// Freeze configuration to prevent accidental modifications
Object.freeze(appConfig);
Object.freeze(appConfig.constants);
Object.freeze(appConfig.messages);
Object.freeze(appConfig.validation);

// Export configuration
window.AppConfig = appConfig;

export default appConfig;
