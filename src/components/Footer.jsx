import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>&copy; {year} LLM Client</p>
        </div>
        
        <div className="footer-center">
          <nav className="footer-nav">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/help">Help</Link>
          </nav>
        </div>
        
        <div className="footer-right">
          <p className="version">Version 1.0.0</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;