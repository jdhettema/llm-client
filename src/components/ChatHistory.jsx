import { useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import * as ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * ChatHistory Component
 * @param {Object} props - Component props
 * @param {Array} props.messages - Array of message objects
 * @param {Boolean} props.loading - Whether a new message is currently loading
 * @param {Function} props.onRetry - Function to retry a failed message
 * @param {Function} props.onDelete - Function to delete a message
 * @returns {JSX.Element} - Rendered component
 */

const ChatHistory = ({ messages = [], loading = false, onRetry, onDelete }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';

        try {
            const date = new Date(timestamp);
            return formatDistanceToNow(date, { addSuffix: true });
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    const renderers = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag='div'
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        }
    };

    return (
        <div className='chat-history'>
            {messages.map((message, index) => (
                <div
                    key={message.id || index}
                    className={`message-container ${message.role}`}
                >
                    <div className='message-avatar'>
                        {message.role === 'user' ? (
                            <div className='avatar user-avatar'>U</div>
                        ) : (
                            <div className='avatar assistant-avatar'>AI</div>
                        )}
                    </div>

                    <div className='message-content'>
                        <div className='message-header'>
                            <span className='message-author'>
                                {message.role === 'user' ? 'You' : 'Assistant'}
                            </span>
                            <span className='message-time'>
                                {formatTime(message.timestamp)}
                            </span>
                        </div>
                    

                        <div className='message-text'>
                            {message.error ? (
                                <div className='message-error'>
                                    <p>Error: {message.error}</p>
                                    {onRetry && (
                                        <button
                                            className='retry-button'
                                            onClick={() => onRetry(message.id)}
                                        >
                                            Retry
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <ReactMarkdown
                                    components={renderers}
                                    className='markdown-content'
                                >
                                    {message.content}
                                </ReactMarkdown>
                            )}
                        </div>

                        <div className='message-actions'>
                            {onDelete && message.role === 'user' && (
                                <button
                                    className='delete-message-button'
                                    onClick={() => onDelete(message.id)}
                                    aria-label='Delete message'
                                >
                                    <span className='delete-icon'>❌</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {loading && (
                <div className='message-container assistant'>
                    <div className='message-avatar'>
                        <div className='avatar assistant-avatar'>AI</div>
                    </div>

                    <div className='message-content'>
                        <div className='message-header'>
                            <span className='message-author'>Assistant</span>
                        </div>

                        <div className='message-text'>
                            <div className='typing-indicator'>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatHistory;