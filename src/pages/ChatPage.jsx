import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import ChatHistory from '../components/ChatHistory';
import PromptForm from '../components/llm/PromptForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import api from '../services/api';

const ChatPage = () => {
    const { currentUser } = useAuth();
    const messageEndRef = useRef(null);
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const {
        activeConversationId,
        messages,
        sendPrompt,
        switchConversation,
        loading,
        error
    } = useChat();

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        console.log('ChatPage component mounted');

        console.log('Current user:', currentUser);
        console.log('Messages:', messages);
        console.log('Loading state:', loading);
        console.log('Error state:', error);

        return () => {
            console.log('ChatPage component unmounted');
        }
    }, [currentUser, messages, loading, error]);
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleConversationChange = async () => {
            if (conversationId && conversationId !== activeConversationId) {
                console.log(`Switching conversation to: ${conversationId}`);
                await switchConversation(conversationId);
            } else if (!conversationId && activeConversationId) {
                navigate(`/chat/${activeConversationId}`, { replace: true });
            }
        };

        handleConversationChange();
    }, [conversationId, activeConversationId, switchConversation, navigate]);

    const handleSendPrompt = async (prompt) => {
        if (!prompt.trim() || loading) return;

        try {
            await sendPrompt(prompt);
        } catch (err) {
            console.error('Error sending prompt:', err);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h1>Chat with LLM</h1>
                <div className="user-info">
                    <span>Logged in as: {currentUser?.username}</span>
                    <span className="role-badge">{currentUser?.role}</span>
                </div>
            </div>

            <div className="chat-messages">
                {messages.length === 0 && !loading ? (
                    <div className="empty-state">
                        <p>No messages yet. Start a conversation!</p>
                    </div>
                ) : (
                    <ChatHistory messages={messages} />
                )}
                {error && <div className="error-message">{error}</div>}
                <div ref={messageEndRef} />
            </div>

            <div className="prompt-container">
                {console.log('Rendering PromptForm', {
                    isPromptFormDefined: !!PromptForm,
                    loadingState: loading,
                })}
                <PromptForm
                    onSendPrompt={handleSendPrompt}
                    isLoading={loading}
                />
                {loading && <LoadingSpinner />}
            </div>
        </div>
    );
};

export default ChatPage;