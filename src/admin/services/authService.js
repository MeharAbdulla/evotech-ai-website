import axios from 'axios';

// System Configuration Constants
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
const LOGIN_ENDPOINT = '/auth/login';
const TOKEN_KEY = 'evotech_ai_admin_token';

// Configure standalone non-intercepted instance for the login terminal itself
const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Enterprise Authentication Service for EVOTECH AI Management System.
 * Manages secure login API connectivity and localized token state isolation.
 */
const authService = {
  /**
   * Helper method to securely persist access token to storage.
   * @param {string} token 
   */
  saveToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      window.dispatchEvent(new Event('auth-change'));
    }
  },

  /**
   * Helper method to extract the active session token from storage.
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Helper method to purge the token configuration from storage.
   */
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Clears existing state vectors and fires the centralized unified event trigger.
   */
 logout() {
  console.log("Logout called");
  this.removeToken();

  // Notify ProtectedRoute
  window.dispatchEvent(new Event('auth-change'));

  // Notify ToastProvider
  window.dispatchEvent(new Event('evotech_auth_logout'));
},

  /**
   * Lightweight manual JWT string decoder to inspect security expiration boundaries.
   * @param {string} token 
   * @returns {object|null} Parsed JWT payload or null if layout structure is invalid
   */
  decodeToken(token) {
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  },

  /**
   * Verifies local token existence and validates if the window of expiration remains valid.
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      this.removeToken();
      return false;
    }

    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      // Direct call ensures the sync state mutation doesn't cycle endlessly
      this.removeToken();
      return false;
    }

    return true;
  },

  /**
   * Authenticates administrator credentials against the FastAPI security pipeline.
   */
  async login(username, password) {
    if (!username?.trim() || !password?.trim()) {
      throw new Error('Username and password are required.');
    }

    try {
      const response = await authClient.post(LOGIN_ENDPOINT, {
        username: username.trim(),
        password: password,
      });

      const { data } = response;

      if (data && data.success === true && data.token) {
        this.saveToken(data.token);
        return data;
      }

      throw new Error('Authentication processing failed. Invalid server signature response.');
    } catch (error) {
      if (error.response) {
        const serverError = error.response.data?.detail || error.response.data?.message;
        if (serverError) {
          throw new Error(typeof serverError === 'object' ? JSON.stringify(serverError) : serverError);
        }
        throw new Error(`Authentication rejected with status terminal sequence: ${error.response.status}`);
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Authentication request timed out. Please verify system processing load.');
      } else if (error.request) {
        throw new Error('Network terminal error. Core API system appears offline or unreachable.');
      }

      throw new Error(error.message || 'An unexpected environment failure occurred during login handling.');
    }
  },
};

export default authService;