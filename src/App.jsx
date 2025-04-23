import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/' element={<MainLayout />}>
              <Route index element={<HomePage />} />
              
              <Route element={<PrivateRoute />}>
                <Route path = 'chat' element={<ChatPage />} />
                <Route path = 'chat/:conversationId' element={<ChatPage />} />
                <Route path = 'settings' element={<SettingsPage />} />
              </Route>
              <Route path='*' element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App
