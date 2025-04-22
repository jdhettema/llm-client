import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // General settings
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [language, setLanguage] = useState('english');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  
  // LLM settings
  const [defaultModel, setDefaultModel] = useState('gpt-4');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  
  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  
  // Profile settings
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Status states
  const [saveStatus, setSaveStatus] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (currentUser) {
      const savedSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      
      setDarkMode(savedSettings.darkMode || false);
      setFontSize(savedSettings.fontSize || 'medium');
      setLanguage(savedSettings.language || 'english');
      setEmailNotifications(savedSettings.emailNotifications || false);
      setDesktopNotifications(savedSettings.desktopNotifications || true);
      setDefaultModel(savedSettings.defaultModel || 'gpt-4');
      setTemperature(savedSettings.temperature || 0.7);
      setMaxTokens(savedSettings.maxTokens || 2048);
      setTwoFactorEnabled(savedSettings.twoFactorEnabled || false);
      setSessionTimeout(savedSettings.sessionTimeout || 60);
      
      setUsername(currentUser.username || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);
  
  const saveGeneralSettings = async () => {
    setIsSaving(true);
    setSaveStatus('');
    setSaveError('');
    
    try {
      const settings = {
        darkMode,
        fontSize,
        language,
        emailNotifications,
        desktopNotifications,
        defaultModel,
        temperature,
        maxTokens,
        twoFactorEnabled,
        sessionTimeout
      };
      
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      if (darkMode) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
      
      setSaveStatus('Settings saved successfully');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveError('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const updatePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setSaveError('New passwords do not match');
      return;
    }
    
    setIsSaving(true);
    setSaveStatus('');
    setSaveError('');
    
    try {
      // Call to API would go here
      // await authService.updatePassword(currentPassword, newPassword);
      
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSaveStatus('Password updated successfully');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveError('Failed to update password. Please check your current password and try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const requestAccountDeletion = () => {
    if (window.confirm('Are you sure you want to request account deletion? This action cannot be undone.')) {
      alert('Account deletion request submitted. An administrator will contact you.');
    }
  };
  
  return (
    <div className="settings-page">
      <h1>Settings</h1>
      
      {(saveStatus || saveError) && (
        <div className={`alert ${saveError ? 'alert-error' : 'alert-success'}`}>
          {saveStatus || saveError}
        </div>
      )}
      
      <div className="settings-grid">
        <div className="settings-section">
          <h2>General</h2>
          
          <div className="setting-group">
            <label className="toggle-label">
              <span>Dark Mode</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <span className="slider round"></span>
              </label>
            </label>
          </div>
          
          <div className="setting-group">
            <label>
              Font Size
              <select 
                value={fontSize} 
                onChange={(e) => setFontSize(e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </label>
          </div>
          
          <div className="setting-group">
            <label>
              Language
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="japanese">Japanese</option>
              </select>
            </label>
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Notifications</h2>
          
          <div className="setting-group">
            <label className="toggle-label">
              <span>Email Notifications</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                />
                <span className="slider round"></span>
              </label>
            </label>
            <p className="setting-description">
              Receive email notifications for important updates
            </p>
          </div>
          
          <div className="setting-group">
            <label className="toggle-label">
              <span>Desktop Notifications</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={desktopNotifications}
                  onChange={() => setDesktopNotifications(!desktopNotifications)}
                />
                <span className="slider round"></span>
              </label>
            </label>
            <p className="setting-description">
              Show browser notifications when new messages arrive
            </p>
          </div>
        </div>
        
        <div className="settings-section">
          <h2>LLM Configuration</h2>
          
          <div className="setting-group">
            <label>
              Default Model
              <select 
                value={defaultModel} 
                onChange={(e) => setDefaultModel(e.target.value)}
              >
                <option value="gpt-4">GPT-4 (Most Powerful)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
                <option value="claude-3">Claude 3 (Alternative)</option>
                <option value="llama-3">Llama 3 (Open Source)</option>
              </select>
            </label>
            <p className="setting-description">
              Note: Your access level may limit available models
            </p>
          </div>
          
          <div className="setting-group">
            <label>
              Temperature: {temperature}
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
              />
            </label>
            <p className="setting-description">
              Lower values (closer to 0) make responses more deterministic and focused. 
              Higher values make responses more random and creative.
            </p>
          </div>
          
          <div className="setting-group">
            <label>
              Max Tokens
              <select 
                value={maxTokens} 
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              >
                <option value="512">512 (Short)</option>
                <option value="1024">1024 (Medium)</option>
                <option value="2048">2048 (Long)</option>
                <option value="4096">4096 (Very Long)</option>
              </select>
            </label>
            <p className="setting-description">
              Maximum length of LLM responses (higher values may increase API costs)
            </p>
          </div>
        </div>
        
        <div className="settings-section">
          <h2>Security</h2>
          
          <div className="setting-group">
            <label className="toggle-label">
              <span>Two-Factor Authentication</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  disabled={currentUser?.role !== 'admin'} // Example: only admins can toggle this
                />
                <span className="slider round"></span>
              </label>
            </label>
            {currentUser?.role !== 'admin' && (
              <p className="setting-description setting-restricted">
                Contact an administrator to enable two-factor authentication
              </p>
            )}
          </div>
          
          <div className="setting-group">
            <label>
              Session Timeout (minutes)
              <select 
                value={sessionTimeout} 
                onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="240">4 hours</option>
              </select>
            </label>
            <p className="setting-description">
              Auto-logout after period of inactivity
            </p>
          </div>
        </div>
        
        <div className="settings-section profile-section">
          <h2>Profile Settings</h2>
          
          <div className="setting-group">
            <label>
              Username
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={true} // Only admin can change usernames
              />
            </label>
            <p className="setting-description setting-restricted">
              Contact an administrator to change your username
            </p>
          </div>
          
          <div className="setting-group">
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={true} // Only admin can change emails
              />
            </label>
            <p className="setting-description setting-restricted">
              Contact an administrator to update your email
            </p>
          </div>
          
          <h3>Change Password</h3>
          <form onSubmit={updatePassword} className="password-form">
            <div className="setting-group">
              <label>
                Current Password
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </label>
            </div>
            
            <div className="setting-group">
              <label>
                New Password
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </label>
            </div>
            
            <div className="setting-group">
              <label>
                Confirm New Password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </label>
            </div>
            
            <button 
              type="submit" 
              className="update-password-button"
              disabled={isSaving}
            >
              {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
      
      <div className="settings-actions">
        <button 
          onClick={saveGeneralSettings} 
          className="save-settings-button"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
        
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
        
        <button onClick={requestAccountDeletion} className="delete-account-button">
          Request Account Deletion
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;