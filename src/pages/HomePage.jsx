import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import llmImage from '../assets/images/llm-illustration.png';


const HomePage = () => {
    const { isAuthenticated, currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/chat');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="home-page">
            <div className="hero-section">
                <div className="hero-content">
                    <h1>Enterprise LLM Portals</h1>
                    <p className="hero-subtitle">
                        Secure, role-based access to powerful language models for your team
                    </p>

                    <div className="cta-buttons">
                        {isAuthenticated ? (
                            <Link to="/chat" className="primary-button">
                                Go to Chat
                            </Link>
                        ) : (
                            <Link to="/login" className="primary-button">
                                Get Started
                            </Link>
                        )}
                        <a 
                            href="https://github.com/jdhettema/llm-server"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="secondary-button"
                        >
                            View on GitHub
                        </a>
                    </div>
                </div>

                <div className="hero-image">
                    <img 
                        src={llmImage} //src/assets/images/llm-illustration.png
                        alt="AI Language Model Illustration"
                    />
                </div>
            </div>

            <div className="features-section">
                <h2>Key Features</h2>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>Role-Based Access</h3>
                        <p>
                            Different permission levels for users, managers and administrators
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Responsive Design</h3>
                        <p>
                            Works seamlessly on desktop, tablet and mobile devices
                        </p>
                    </div>
                </div>
            </div>

            <div className="how-it-works">
                <h2>How It Works</h2>

                <div className="steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Login</h3>
                        <p>
                            Access the system with your unique credentials
                        </p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>Ask Questions</h3>
                        <p>
                            Interact with the LLM using natural language
                        </p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Get Insights</h3>
                        <p>
                            Receive tailored response based on your access level
                        </p>
                    </div>
                </div>
            </div>

            <div className="security-note">
                <h2>Enterprise-Grade Security</h2>
                <p>
                    All communications are encrypted, and access is strictly controlled based on user roles.
                        Your data never leaves your control, ensuring maximum security and compliance.
                </p>
            </div>
        </div>
    );
};

export default HomePage;