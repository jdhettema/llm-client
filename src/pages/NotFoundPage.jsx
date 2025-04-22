import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate(isAuthenticated ? '/chat' : '/');
    }
  }, [countdown, navigate, isAuthenticated]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (isAuthenticated) {
        navigate(`/chat?q=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate(`/?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };
  
  const errorQuotes = [
    "Looks like our AI is still learning navigation...",
    "Even the most intelligent LLMs get lost sometimes...",
    "This conversation thread seems to have wandered off...",
    "Hmm, our neural networks can't find this path...",
    "404: Brain cells temporarily unavailable.",
    "This page has been tokenized out of existence."
  ];
  
  const randomQuote = errorQuotes[Math.floor(Math.random() * errorQuotes.length)];
  
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="error-code">404</div>
        
        <h1>Page Not Found</h1>
        
        <p className="error-quote">{randomQuote}</p>
        
        <div className="robot-animation">
          <div className="robot">
            <div className="robot-head">
              <div className="robot-eye left"></div>
              <div className="robot-eye right"></div>
              <div className="robot-mouth"></div>
            </div>
            <div className="robot-body">
              <div className="robot-arm left"></div>
              <div className="robot-arm right"></div>
            </div>
          </div>
        </div>
        
        <p className="redirect-message">
          Redirecting you {isAuthenticated ? 'back to chat' : 'to home'} in <span className="countdown">{countdown}</span> seconds...
        </p>
        
        <div className="action-buttons">
          <Link to={isAuthenticated ? '/chat' : '/'} className="primary-button">
            {isAuthenticated ? 'Back to Chat' : 'Go to Home'}
          </Link>
          
          <button onClick={() => window.history.back()} className="secondary-button">
            Go Back
          </button>
        </div>
        
        <div className="search-section">
          <p>Looking for something specific?</p>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Try searching here..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
        </div>
        
        <div className="suggestions">
          <p>You might want to check out:</p>
          <ul>
            <li><Link to="/">Home Page</Link></li>
            {isAuthenticated && <li><Link to="/chat">Chat Interface</Link></li>}
            {isAuthenticated && <li><Link to="/settings">Settings</Link></li>}
            <li><a href="https://github.com/jdhettema/llm-server" target="_blank" rel="noopener noreferrer">GitHub Project</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;