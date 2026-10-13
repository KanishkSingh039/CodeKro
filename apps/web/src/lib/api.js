/**
 * CodeKro API Client Stub
 * Ready for backend connectivity. No mutations made to existing backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   */
  async login(credentials) {
    // Placeholder - hook functionality here when ready
    console.info('[apiClient] login called with:', { email: credentials?.email });
    return Promise.resolve({ success: true, message: 'Ready for integration' });
  },

  /**
   * Register user
   * @param {Object} data - { name, username, email, password }
   */
  async register(data) {
    // Placeholder - hook functionality here when ready
    console.info('[apiClient] register called with:', { 
      name: data?.name, 
      username: data?.username, 
      email: data?.email 
    });
    return Promise.resolve({ success: true, message: 'Ready for integration' });
  },
};
