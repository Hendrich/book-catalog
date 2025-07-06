/**
 * API Service
 * Centralized HTTP client for all API communications
 */

import appConfig from "../config.js";
import notificationManager from "../components/notifications.js";

class ApiService {
  constructor() {
    this.baseUrl = appConfig.apiBaseUrl;
    this.timeout = appConfig.requestTimeout;
    this.retryAttempts = appConfig.constants.RETRY_ATTEMPTS;
  }

  /**
   * Generic request method with retry logic and error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    const config = {
      method: "GET",
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    };

    // Add timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    let lastError = null;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        if (appConfig.enableDebugMode) {
          console.log(`🌐 API Request (attempt ${attempt}):`, {
            method: config.method,
            url,
            headers: config.headers,
            body: options.body,
          });
        }

        const response = await fetch(url, config);
        clearTimeout(timeoutId);

        // Handle response
        const result = await this.handleResponse(response);

        if (appConfig.enableDebugMode) {
          console.log("✅ API Response:", result);
        }

        return result;
      } catch (error) {
        lastError = error;
        clearTimeout(timeoutId);

        console.error(`❌ API Request failed (attempt ${attempt}):`, error);

        // Don't retry on client errors (4xx) or if it's the last attempt
        if (this.isClientError(error) || attempt === this.retryAttempts) {
          break;
        }

        // Wait before retry (exponential backoff)
        await this.sleep(Math.pow(2, attempt) * 1000);
      }
    }

    // Handle final error
    throw this.handleError(lastError);
  }

  /**
   * Handle HTTP response
   */
  async handleResponse(response) {
    let data;

    try {
      data = await response.json();
    } catch (error) {
      // If JSON parsing fails, create a generic response
      data = {
        success: false,
        error: {
          message: "Invalid response format",
          code: "PARSE_ERROR",
        },
      };
    }

    if (!response.ok) {
      const error = new Error(data.error?.message || `HTTP ${response.status}`);
      error.status = response.status;
      error.code = data.error?.code;
      error.data = data;
      throw error;
    }

    return data;
  }

  /**
   * Handle API errors and show user-friendly messages
   */
  handleError(error) {
    let userMessage = appConfig.messages.error.genericError;

    if (error.name === "AbortError") {
      userMessage = "Request timeout. Please try again.";
    } else if (error.status === 401) {
      userMessage = appConfig.messages.error.unauthorized;
    } else if (error.status === 403) {
      userMessage = "Access denied.";
    } else if (error.status === 404) {
      userMessage = "Resource not found.";
    } else if (error.status === 429) {
      userMessage = "Too many requests. Please wait a moment.";
    } else if (error.status >= 500) {
      userMessage = "Server error. Please try again later.";
    } else if (!navigator.onLine) {
      userMessage = appConfig.messages.error.networkError;
    } else if (error.message) {
      userMessage = error.message;
    }

    // Show error notification (except for 401 which is handled by auth service)
    if (error.status !== 401) {
      notificationManager.error(userMessage);
    }

    return error;
  }

  /**
   * Check if error is a client error (4xx)
   */
  isClientError(error) {
    return error.status >= 400 && error.status < 500;
  }

  /**
   * Sleep utility for retry logic
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get auth token from localStorage
   */
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * GET request
   */
  async get(endpoint, token = null) {
    const headers = {};
    const authToken = token || this.getAuthToken();
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    return this.request(endpoint, {
      method: "GET",
      headers,
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data = null, token = null) {
    const headers = {};
    const authToken = token || this.getAuthToken();
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    return this.request(endpoint, {
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : null,
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = null, token = null) {
    const headers = {};
    const authToken = token || this.getAuthToken();
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    return this.request(endpoint, {
      method: "PUT",
      headers,
      body: data ? JSON.stringify(data) : null,
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, token = null) {
    const headers = {};
    const authToken = token || this.getAuthToken();
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    return this.request(endpoint, {
      method: "DELETE",
      headers,
    });
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const result = await this.get("/health");
      return result.success;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get API statistics (development only)
   */
  async getStats() {
    if (appConfig.environment !== "development") {
      throw new Error("Stats endpoint only available in development");
    }

    return this.get("/api/stats");
  }
}

// Create and export singleton instance
const apiService = new ApiService();

export default apiService;
