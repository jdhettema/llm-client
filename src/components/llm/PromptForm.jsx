import { useState } from 'react';
import Button from '../common/Button';

const PromptForm = ({ onSendPrompt, isLoading }) => {
    const [prompt, setPrompt] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            onSendPrompt(prompt);
            setPrompt('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="prompt-form">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your message here..."
                rows={3}
                disabled={isLoading}
                className="prompt-input"
            />
            <Button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="send-button"
            >
                {isLoading ? 'Sending...' : 'Send'}
            </Button>
        </form>
    );
};

export default PromptForm;