import api from './api';
import jwtDecode from 'jwt-decode';

/**
 * Auth Service for handling authentication-related API calls
 */

const authService = {
    /**
   * Login a user with username and password
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<Object>} - Token and user data
   */
    login: async (username, password) => {
        try {
            const response = await api.post('/login', { username, password });
            const { token } = response.data;

            localStorage.setItem('token', token);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error ('Login failed');
        }
    },

    /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - New user data
   */
  register: async (userData) => {
    try {
        const response = await api.post('/register', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Registration failed');
    }
  },

  /**
   * Logout the current user
   */
  logout: () => {
    localStorage.removeItem('token');

    delete api.defaults.headers.common['Authorization'];
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user has valid token
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return false;
    }

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decodedToken.exp > currentTime;
    } catch (error) {
        return false;
    }
  },

  /**
   * Get current user information from token
   * @returns {Object|null} - User data or null if not authenticated
   */
  getCurrentUser: () => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            return null;
        }

        const decodedToken = jwtDecode(token);

        return {
            id: decodedToken.id,
            username: decodedToken.username,
            email: decodedToken.email,
            role: decodedToken.role
        };
    } catch (error) {
        return null;
    }
  },

  /**
   * Initialize auth state from localStorage
   * Sets up API headers if token exists
   */
  initAuth: () => {
    const token = localStorage.getItem('token');

    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },

  /**
   * Update user profile information
   * @param {Object} userData - Updated user profile data
   * @returns {Promise<Object>} - Updated user data
   */
  updateProfile: async (userData) => {
    try {
        const response = await api.put('/users/profile', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Profile update failed');
    }
  },

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} - Success message
   */
  updatePassword: async (currentPassword, newPassword) => {
    try {
        const response = await api.put('/users/password', {
            currentPassword,
            newPassword
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Password update failed');
    }
  },

  /**
   * Request password reset email
   * @param {string} email - User's email address
   * @returns {Promise<Object>} - Success message
   */
  requestPasswordReset: async (email) => {
    try {
        const response = await api.post('/users/reset-password', { email });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Password reset request failed');
    }
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token from email
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} - Success message
   */
  resetPassword: async (token, newPassword) => {
    try {
        const response = await api.post(`/users/reset-password/${token}`, {
            password: newPassword
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Password reset failed');
    }
  },

  /**
   * Verify user's email with token
   * @param {string} token - Email verification token
   * @returns {Promise<Object>} - Success message
   */
  verifyEmail: async (token) => {
    try {
        const response = await api.get(`/users/verify-email/${token}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Email verification failed');
    }
  },

  /**
   * Check if user has specific permission
   * @param {string} permission - Permission to check
   * @returns {boolean} - True if user has permission
   */
  hasPermission: (permission) => {
    const user = authService.getCurrentUser();

    if (!user) {
        return false;
    }

    const rolePermissions = {
        admin: ['manage_users', 'view_all_data', 'manage_settings', 'delete_messages'],
        manager: ['view_all_data', 'manage_settings', 'delete_messages'],
        user: ['view_own_data', 'delete_own_messages']
    };

    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes(permission);
  }
};

export default authService;