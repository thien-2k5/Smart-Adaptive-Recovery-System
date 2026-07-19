import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Bell } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import CreateShipment from './pages/CreateShipment';
import MyShipment from './pages/MyShipment';
import RecoveryCenter from './pages/RecoveryCenter';
import AdminDashboard from './pages/AdminDashboard';
import HelpCenter from './pages/HelpCenter';
import { NotificationProvider } from './context/NotificationContext';
import { useSseClient } from './services/SseClient';
import './i18n/i18n';

// Inner App component to use hooks that require Context/Router
function AppContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  
  // For demo, assume customer ID 1 is the logged-in user viewing tracking
  useSseClient(1);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi');
  };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <header className="border-b bg-card py-4 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary text-white font-black text-2xl px-2 py-1 rounded italic tracking-tighter">
              VIETTEL POST
            </div>
            <span className="font-semibold text-muted-foreground hidden md:inline">| SARS</span>
          </Link>
          
          <nav className="hidden md:flex gap-6 font-medium">
            <Link to="/" className={`hover:text-primary transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}>{t('nav.home')}</Link>
            <Link to="/tracking" className={`hover:text-primary transition-colors ${location.pathname === '/tracking' ? 'text-primary' : 'text-muted-foreground'}`}>{t('nav.tracking')}</Link>
            <Link to="/help" className={`hover:text-primary transition-colors ${location.pathname === '/help' ? 'text-primary' : 'text-muted-foreground'}`}>{t('nav.help')}</Link>
            <Link to="/admin" className={`hover:text-primary transition-colors ${location.pathname === '/admin' ? 'text-primary' : 'text-muted-foreground'}`}>{t('nav.admin')}</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card"></span>
            </button>
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 border rounded-full hover:bg-muted transition-colors text-sm font-medium"
            >
              <Globe size={16} />
              {i18n.language.toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<CreateShipment />} />
          <Route path="/tracking" element={<MyShipment />} />
          <Route path="/recovery/:caseId" element={<RecoveryCenter />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      
      <footer className="border-t bg-muted/50 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Viettel Post - Smart Adaptive Recovery System Demo.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
