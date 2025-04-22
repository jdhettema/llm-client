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
  },

  getConversations: async () => {
    try {
        const response = await api.get('/conversations');
        return response.data;
    } catch (error) {
        console.error('Error fetching conversations:', error);
        throw error;
    }
  },

  getConversationMessages: async (conversationId) => {
    try {
        const response = await api.get(`/conversations/${conversationId}/messages`);
        return response.data;
    } catch (error) {
        console.error('Error fetching conversation messages:', error);
        throw error;
    }
  },
  createConversation: async (data) => {
    try {
        const response = await api.post('/conversations', data);
        return response.data;
    } catch (error) {
        console.error('Error creating conversation:', error);
        throw error;
    }
  },

  updateConversation: async (conversationId) => {
    try {
        const response = await api.put(`/conversations/${conversationId}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating conversation:', error);
        throw error;
    }
  },

    deleteConversation: async (conversationId) => {
        try {
            await api.delete(`/conversations/${conversationId}`);
            return true;
        } catch (error) {
            console.error('Error deleting conversation:', error);
            throw error;
        }
    },
};