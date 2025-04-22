import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header = ({ toggleSidebar, sidebarOpen, userName, userRole }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className={`sidebar-toggle ${sidebarOpen ? 'active' : ''}`} 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <Link to="/" className="logo">
          <h1>LLM Client</h1>
        </Link>
      </div>
      
      <div className="header-right">
        {userName && (
          <div className="user-menu">
            <button 
              className="user-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="username">{userName}</span>
              <span className="role-badge">{userRole}</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile" onClick={() => setShowDropdown(false)}>
                  Profile
                </Link>
                <Link to="/settings" onClick={() => setShowDropdown(false)}>
                  Settings
                </Link>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;