import api from './api';

export const llmService = {
    /**
   * Send a query to the LLM
   * @param {string} prompt - The user's prompt text
   * @returns {Promise} - Promise with response data
   */
  sendQuery: async (prompt) => {
    try {
        const response = await api.post('/query', { prompt });
        return response.data;
    } catch (error){
        console.error('Error querying LLM:', error);
        throw error;
    }
  },

  /**
   * Get chat history for the current user
   * @returns {Promise} - Promise with history data
   */
  getChatHistory: async () => {
    try {
        const response = await api.get('/history');
        return response.data;
    } catch (error) {
        console.error('Error fetching chat history:', error);
        throw error;
    }
  }
};