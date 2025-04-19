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
            return { ...state, activeConversationId: action.payload };
        case ACTIONS.CREATE_CONVERSATION:
            return { ...state, conversations: [...state.conversations, action.payload] };
        case ACTIONS.DELETE_CONVERSATION:
            return {
                ...state,
                conversations: state.conversations.filter(conv => conv.id !== action.payload)
            };
        case ACTIONS.SET_HISTORY:
            return { ...state, history: action.payload };
        case ACTIONS.SET_SAVING:
            return { ...state, isSaving: action.payload };
        default:
            return state;
    }
}