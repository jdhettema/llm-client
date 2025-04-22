import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, isAuthenticated, error: authError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/chat');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (authError) {
            setError(authError);
            setIsSubmitting(false);
        }
    }, [authError]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError('Username and password are required');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const success = await login(username, password);

            if (success) {
                if (rememberMe) {
                    localStorage.setItem('preferredUsername', username);
                } else {
                    localStorage.removeItem('preferredUsername');
                }

                navigate('/chat');
            } else {
                setIsSubmitting(false);
            }
        } catch (err) {
            setError('An unexpected error occurred');
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const savedUsername = localStorage.getItem('preferredUsername');
        if (savedUsername) {
            setUserName(savedUsername);
            setRememberMe(true);
        }
    }, []);

    return (
        <div className='login-page'>
            <div className='login-container'>
                <div className='login-header'>
                    <h1>LLM Client</h1>
                    <p>Sign in to access your AI assistant</p>
                </div>

                {error && (
                    <div className='error-alert'>
                        <span className='error-icon'>⚠️</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Enter your username"
                            disabled={isSubmitting}
                            autocomplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            disabled={isSubmitting}
                            autocomplete="current-password"
                        />
                    </div>

                    <div className="form-group remember-me">
                        <label className='checkbox-label'>
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                disabled={isSubmitting}
                            />
                            <span className='checkbox-text'>Remember me</span>
                        </label>

                        <Link to='/forgot-password' className='forgot-password'>
                            Forgot password?
                        </Link>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className='login-button'
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className='Login-footer'>
                    <p>
                        Don't have an account? 
                        <Link to='/register' className='register-link'>
                            Contact admin
                        </Link>
                    </p>
                </div>
            </div>

            <div className='login-image'>
                <img
                    src="/images/llm-illustration.png"
                    alt="AI Language Model Illustration"
                />
            </div>
        </div>
    );
};

export default LoginPage;