import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';

const MainLayout = () => {
    const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
    const { conversations, activeConversationId } = useChat();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile && sidebarOpen) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [sidebarOpen]);

    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    }, [location.pathname, isMobile]);

    useEffect(() => {
        if (!authLoading && !isAuthenticated && location.pathname !== '/') {
            navigate('/login');
        }
    }, [authLoading, isAuthenticated, location.pathname, navigate]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="app-container">
            <Header
                toggleSidebar={toggleSidebar}
                sidebarOpen={sidebarOpen}
                userName={currentUser?.username}
                userRole={currentUser?.role}
            />

            <div className="main-content">
                <Sidebar
                    isOpen={sidebarOpen}
                    isMobile={isMobile}
                    onClose={() => setSidebarOpen(false)}
                    conversations={conversations}
                    activeConversationId={activeConversationId}
                    userRole={currentUser?.role}
                />

                <main className={`content-area ${sidebarOpen ? 'with-sidebar' : 'sidebar-collapsed'}`}>
                    <Outlet context={{ isMobile, sidebarOpen }} />
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default MainLayout;