#!/usr/bin/env node

/**
 * API Testing Script
 * Quick test untuk semua endpoint API
 */

const https = require("https");
const http = require("http");

const API_BASE = {
  local: "http://localhost:3000",
  production: "https://book-catalog-app-z8p8.onrender.com",
};

// Test credentials
const TEST_USER = {
  email: "test.user@example.com",
  password: "testpassword123",
};

/**
 * Make HTTP request
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith("https");
    const client = isHttps ? https : http;

    const defaultOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "API-Test-Script/1.0.0",
      },
    };

    const reqOptions = { ...defaultOptions, ...options };

    const req = client.request(url, reqOptions, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed,
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
          });
        }
      });
    });

    req.on("error", reject);

    if (reqOptions.body) {
      req.write(reqOptions.body);
    }

    req.end();
  });
}

/**
 * Test endpoint
 */
async function testEndpoint(name, url, options = {}) {
  console.log(`\n🧪 Testing: ${name}`);
  console.log(`📍 URL: ${url}`);

  try {
    const result = await makeRequest(url, options);

    console.log(`✅ Status: ${result.status}`);
    console.log(`📋 Response:`, JSON.stringify(result.data, null, 2));

    return result;
  } catch (error) {
    console.log(`❌ Error:`, error.message);
    return { status: 0, error: error.message };
  }
}

/**
 * Test suite untuk satu environment
 */
async function testEnvironment(env) {
  const baseUrl = API_BASE[env];
  console.log(`\n🚀 Testing ${env.toUpperCase()} Environment: ${baseUrl}`);
  console.log("=".repeat(50));

  let authToken = null;

  // 1. Health check
  await testEndpoint("Health Check", `${baseUrl}/health`);

  // 2. Register user
  const registerResult = await testEndpoint(
    "Register User",
    `${baseUrl}/api/auth/register`,
    {
      method: "POST",
      body: JSON.stringify({
        email: `test.${Date.now()}@example.com`,
        password: TEST_USER.password,
      }),
    }
  );

  // 3. Login user
  const loginResult = await testEndpoint(
    "Login User",
    `${baseUrl}/api/auth/login`,
    {
      method: "POST",
      body: JSON.stringify(TEST_USER),
    }
  );

  if (
    loginResult.data &&
    loginResult.data.data &&
    loginResult.data.data.token
  ) {
    authToken = loginResult.data.data.token;
    console.log(`🔑 Auth token obtained: ${authToken.substring(0, 20)}...`);
  }

  // 4. Get user info (if token available)
  if (authToken) {
    await testEndpoint("Get User Info", `${baseUrl}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    // 5. Get all books
    await testEndpoint("Get All Books", `${baseUrl}/api/books`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    // 6. Add a book
    const addBookResult = await testEndpoint(
      "Add New Book",
      `${baseUrl}/api/books`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: "Test Book - API Script",
          author: "Test Author",
        }),
      }
    );

    // 7. If book was added, try to update and delete it
    if (
      addBookResult.data &&
      addBookResult.data.data &&
      addBookResult.data.data.id
    ) {
      const bookId = addBookResult.data.data.id;

      await testEndpoint("Update Book", `${baseUrl}/api/books/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: "Updated Test Book - API Script",
          author: "Updated Test Author",
        }),
      });

      await testEndpoint("Delete Book", `${baseUrl}/api/books/${bookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
    }
  } else {
    console.log("⚠️ No auth token available, skipping authenticated endpoints");
  }
}

/**
 * Main test runner
 */
async function main() {
  console.log("🧪 Book Catalog API Testing Script");
  console.log("===================================");

  const envToTest = process.argv[2] || "both";

  if (envToTest === "local" || envToTest === "both") {
    await testEnvironment("local");
  }

  if (envToTest === "production" || envToTest === "both") {
    await testEnvironment("production");
  }

  console.log("\n✅ Testing completed!");
  console.log("\n💡 Usage:");
  console.log("  node test-api.js           # Test both environments");
  console.log("  node test-api.js local     # Test local only");
  console.log("  node test-api.js production # Test production only");
}

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Run the tests
main().catch((error) => {
  console.error("❌ Test runner error:", error);
  process.exit(1);
});
