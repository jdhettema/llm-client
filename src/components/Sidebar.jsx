import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';

const Sidebar = ({ 
  isOpen, 
  isMobile, 
  onClose, 
  conversations, 
  activeConversationId, 
  userRole 
}) => {
  const navigate = useNavigate();
  const { 
    createConversation, 
    switchConversation, 
    deleteConversation,
    isLoading
  } = useChat();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleCreateNewChat = async () => {
    if (isLoading) return;
    
    const newId = await createConversation('New Conversation');
    if (newId) {
      navigate('/chat');
    }
  };

  const handleSelectConversation = async (id) => {
    if (isLoading) return;
    
    await switchConversation(id);
    if (isMobile) {
      onClose();
    }
    navigate('/chat');
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setShowDeleteConfirm(id);
  };

  const handleConfirmDelete = async (e, id) => {
    e.stopPropagation();
    await deleteConversation(id);
    setShowDeleteConfirm(null);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(null);
  };

  // Get sorted conversations with newest first
  const sortedConversations = [...(conversations || [])].sort((a, b) => {
    return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
  });

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {isMobile && isOpen && (
        <div className="sidebar-backdrop" onClick={onClose}></div>
      )}
      
      <div className="sidebar-content">
        <div className="sidebar-header">
          <h2>Conversations</h2>
          {isMobile && (
            <button 
              className="close-sidebar" 
              onClick={onClose}
              aria-label="Close sidebar"
            >
              ×
            </button>
          )}
        </div>
        
        <button 
          className="new-chat-button" 
          onClick={handleCreateNewChat}
          disabled={isLoading}
        >
          <span className="icon">+</span> New Conversation
        </button>
        
        <nav className="conversation-list">
          {sortedConversations.length === 0 ? (
            <div className="no-conversations">
              <p>No conversations yet</p>
              <p>Start a new conversation to get started</p>
            </div>
          ) : (
            <ul>
              {sortedConversations.map((conversation) => (
                <li 
                  key={conversation.id}
                  className={activeConversationId === conversation.id ? 'active' : ''}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="conversation-item">
                    <span className="conversation-title">
                      {conversation.title}
                    </span>
                    <div className="conversation-actions">
                      {showDeleteConfirm === conversation.id ? (
                        <div className="delete-confirm">
                          <button 
                            className="confirm-yes"
                            onClick={(e) => handleConfirmDelete(e, conversation.id)}
                          >
                            Yes
                          </button>
                          <button 
                            className="confirm-no"
                            onClick={handleCancelDelete}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="delete-button"
                          onClick={(e) => handleDeleteClick(e, conversation.id)}
                          aria-label="Delete conversation"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </nav>
        
        <div className="sidebar-footer">
          <div className="role-info">
            <span className="role-label">Access Level:</span>
            <span className="role-value">{userRole}</span>
          </div>
          
          <nav className="sidebar-nav">
            <Link to="/" onClick={isMobile ? onClose : undefined}>Home</Link>
            <Link to="/settings" onClick={isMobile ? onClose : undefined}>Settings</Link>
            {userRole === 'admin' && (
              <Link to="/admin" onClick={isMobile ? onClose : undefined}>Admin</Link>
            )}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;