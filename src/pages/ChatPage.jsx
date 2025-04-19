import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import ChatHistory from '../components/ChatHistory';
import PromptForm from '../components/llm/PromptForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { llmService } from '../services/llmService';

const ChatPage = () => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const history = await llmService.getChatHistory();
                setMessages(history);
            } catch (err) {
                setError('Failed to load chat history');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleSendPrompt = async (prompt) => {
        if (!prompt.trim()) return;

        const userMessage = {
            id: Date.now(),
            content: prompt,
            role: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setLoading(true);
        setError(null);

        try {
            const response = await llmService.sendQuery(prompt);

            const assistantMessage = {
                id: Date.now() + 1,
                content: response.response,
                role: 'assistant',
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            setError('Failed to get a response. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h1>Chat with LLM</h1>
                <div className="user-info">
                    <span>Logged in as: {currentUser.username}</span>
                    <span className="role-badge">{currentUser.role}</span>
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