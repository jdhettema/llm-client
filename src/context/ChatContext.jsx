import { createContext, useState, useReducer, useEffect } from 'react';
import { llmService } from '../services/llmService';

export const ChatContext = createContext();

const initialState = {
    messages: [],
    history: [], 
    conversations: [],
    activeConversationId: null,
    isLoadin: false,
    error: null,
    isSaving: false
};

const ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_MESSAGES: 'SET_MESSAGES',
    ADD_MESSAGE: 'ADD_MESSAGE',
    SET_CONVERSATIONS: 'SET_CONVERSATIONS',
    SET_ACTIVE_CONVERSATION: 'SET_ACTIVE_CONVERSATION',
    CREATE_CONVERSATION: 'CREATE_CONVERSATION',
    DELETE_CONVERSATION: 'DELETE_CONVERSATION',
    SET_HISTORY: 'SET_HISTORY',
    SET_SAVING: 'SET_SAVING',
};

const chatReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload };
        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload };
        case ACTIONS.SET_MESSAGES:
            return { ...state, messages: action.payload };
        case ACTIONS.ADD_MESSAGE:
            return { ...state, messages: [...state.messages, action.payload] };
        case ACTIONS.SET_CONVERSATIONS:
            return { ...state, conversations: action.payload };
        case ACTIONS.SET_ACTIVE_CONVERSATION:
            return { ...state, activeConversationId: action.payload, messages: state.conversations.find(c => c.id === action.payload)?.messages || [] };
        case ACTIONS.CREATE_CONVERSATION:
            const newConversation = {
                id: action.payload.id,
                title: action.payload.title,
                messages: [],
                createdAt: new Date().toISOString()
            };
        
            return { ...state, conversations: [...state.conversations, newConversation], activeConversationId: newConversation.id, messages: [] };
        case ACTIONS.DELETE_CONVERSATION:
            return {
                ...state,
                conversations: state.conversations.filter(c => c.id !== action.payload),
                activeConversationId: state.activeConversationId === action.payload ? (state.conversations.length > 1 ? state.conversations.find(c => c.id !== action.payload)?.id : null) 
                    : state.activeConversationId,
                messages: state.activeConversationId === action.payload ? [] : state.messages
            };
        case ACTIONS.SET_HISTORY:
            return { ...state, history: action.payload };
        case ACTIONS.SET_SAVING:
            return { ...state, isSaving: action.payload };
        default:
            return state;
    }
};

export const ChatProvider = ({ children }) => {
    const [state, dispatch] = useReducer(chatReducer, initialState);

    useEffect(() => {
        const loadConversations = async () => {
            try {
                dispatch({ type: ACTIONS.SET_LOADING, payload: true });

                const conversationsData = await llmService.getConversations();
                dispatch({
                    type: ACTIONS.SET_CONVERSATIONS,
                    payload: conversationsData
                });

                if (conversationsData.length > 0) {
                    const mostRecent = conversationsData.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
                    dispatch({
                        type: ACTIONS.SET_ACTIVE_CONVERSATION,
                        payload: mostRecent.id
                    });

                    const messagesData = await llmService.getConversationMessages(mostRecent.id);
                    dispatch({
                        type: ACTIONS.SET_MESSAGES,
                        payload: messagesData
                    });
                }
            } catch (error) {
                console.error('Failed to load conversations', error);
                dispatch({
                    type: ACTIONS.SET_ERROR,
                    payload: 'Failed to load conversations. Please try again.'
                });
            } finally {
                dispatch({ type: ACTIONS.SET_LOADING, payload: false });
            }
        };

        loadConversations();
    }, []);

    const sendPrompt = async (prompt) => {
        if (!prompt.trim()) return;

        try {
            if (!state.activeConversationId) {
                const newConversation = await llmService.createConversation({ title: prompt.slice(0, 30) + (prompt.length > 30 ? '...' : '')
                });

                dispatch({
                    type: ACTIONS.CREATE_CONVERSATION,
                    payload: {
                        id: newConversation.id,
                        title: newConversation.title
                    }
                });
            }

            const userMessage = {
                id: Date.now().toString(),
                content: prompt,
                role: 'user',
                timestamp: new Date().toISOString(),
                conversationId: state.activeConversationId
            };

            dispatch({ type: ACTIONS.ADD_MESSAGE, payload: userMessage });
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });
            dispatch({ type: ACTIONS.SET_ERROR, payload: null });

            const response = await llmService.sendQuery({ 
                prompt,
                conversationId: state.activeConversationId
            });

            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                content: response.response,
                role: 'assistant',
                timestamp: new Date().toISOString(),
                conversationId: state.activeConversationId
            };

            dispatch({ type: ACTIONS.ADD_MESSAGE, payload: assistantMessage });

            if (state.conversations.find(c => c.id === state.activeConversationId)?.messages.length === 0) {
                await llmService.updateConversation(state.activeConversationId, {
                    title: generateTitle(prompt, response.response)
                });

                const conversationsData = await llmService.getConversations();
                dispatch({ type: ACTIONS.SET_CONVERSATIONS, payload: conversationsData });
            }

            return true;
        } catch (error) {
            console.error('Failed to send prompt', error);
            dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to get a response. Please try again.' });
            return false;
        } finally {
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
    };

    const generateTitle = (prompt, response) => {
        const promptStart = prompt.split(' ').slice(0, 5).join(' ');
        return `${promptStart}${promptStart.length < prompt.length ? '...' : ''}`
    };

    const createConversation = async (title = 'New Conversation') => {
        try {
            dispatch({
                type: ACTIONS.CREATE_CONVERSATION,
                payload: {
                    id: newConversation.id,
                    title: newConversation.title
                }
            });

            return newConversation.id;
        } catch (error) {
            console.error('Failed to create conversation', error);
            dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to create conversation. Please try again.' });
            return null;
        } finally {
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
    };

    const switchConversation = async (conversationId) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });

            const messagesData = await llmService.getConversationMessages(conversationId);

            dispatch({ type: ACTIONS.SET_MESSAGES, payload: messagesData });
            dispatch({ type: ACTIONS.SET_ACTIVE_CONVERSATION, payload: conversationId });

            return true;
        } catch (error) {
            console.error('Error switching conversation', error);
            dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to switch conversation. Please try again.' });
            return false;
        } finally {
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
    };

    const deleteConversation = async (conversationId) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true });

            await llmService.deleteConversation(conversationId);

            dispatch({ type: ACTIONS.DELETE_CONVERSATION, payload: conversationId });

            return true;
        } catch (error) {
            console.error('Error deleting conversation', error);
            dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to delete conversation. Please try again.' });
            return false;
        } finally {
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
    };

    return (
        <ChatContext.Provider
            value={{
                ...state,
                sendPrompt,
                createConversation,
                switchConversation,
                deleteConversation,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};