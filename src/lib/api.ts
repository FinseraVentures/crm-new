/**
 * API Service Utility
 * Centralized HTTP client for making API requests with CONFIG settings
 */

import CONFIG, { API_ENDPOINTS, getApiUrl } from "@/config/env";

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

/**
 * Make an API request with error handling and retry logic
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    headers = {},
    body,
    timeout = CONFIG.api.timeout,
  } = options;

  const url = getApiUrl(endpoint);
  let attempt = 0;
  const maxRetries = CONFIG.api.retries;

  // Get auth token from localStorage
  const token = localStorage.getItem(CONFIG.auth.tokenKey);

  // Default headers
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Add authorization header if token exists
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  while (attempt < maxRetries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: defaultHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Log in development
      if (CONFIG.features.enableLogging) {
        console.log(`[API] ${method} ${endpoint}`, {
          status: response.status,
          data,
        });
      }

      if (!response.ok) {
        // Handle unauthorized (401) - token might be expired
        if (response.status === 401) {
          // Clear auth and redirect to login
          localStorage.removeItem(CONFIG.auth.tokenKey);
          // localStorage.removeItem(CONFIG.auth.userKey);
          window.location.href = "/login";
        }

        throw new Error(data?.message || `HTTP ${response.status}`);
      }

      return {
        success: true,
        data,
        status: response.status,
      };
    } catch (error) {
      attempt++;

      const errorMessage = error instanceof Error ? error.message : String(error);

      // Don't retry on certain errors
      if (
        errorMessage.includes("401") ||
        errorMessage.includes("403") ||
        errorMessage.includes("404")
      ) {
        return {
          success: false,
          error: errorMessage,
          status: parseInt(errorMessage.match(/\d+/)?.[0] || "500"),
        };
      }

      // Log error in development
      if (CONFIG.features.enableLogging) {
        console.error(`[API Error] ${method} ${endpoint} (Attempt ${attempt}/${maxRetries})`, errorMessage);
      }

      // If this is the last attempt, return the error
      if (attempt >= maxRetries) {
        return {
          success: false,
          error: errorMessage,
          status: 500,
        };
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  return {
    success: false,
    error: "Max retries exceeded",
    status: 500,
  };
}

/**
 * GET request
 */
export function apiGet<T = any>(endpoint: string, options?: ApiRequestOptions) {
  return apiRequest<T>(endpoint, { ...options, method: "GET" });
}

/**
 * POST request
 */
export function apiPost<T = any>(endpoint: string, body?: any, options?: ApiRequestOptions) {
  return apiRequest<T>(endpoint, { ...options, method: "POST", body });
}

/**
 * PUT request
 */
export function apiPut<T = any>(endpoint: string, body?: any, options?: ApiRequestOptions) {
  return apiRequest<T>(endpoint, { ...options, method: "PUT", body });
}

/**
 * PATCH request
 */
export function apiPatch<T = any>(endpoint: string, body?: any, options?: ApiRequestOptions) {
  return apiRequest<T>(endpoint, { ...options, method: "PATCH", body });
}

/**
 * DELETE request
 */
export function apiDelete<T = any>(endpoint: string, options?: ApiRequestOptions) {
  return apiRequest<T>(endpoint, { ...options, method: "DELETE" });
}

/**
 * Export endpoints for easy access
 */
export { API_ENDPOINTS };
