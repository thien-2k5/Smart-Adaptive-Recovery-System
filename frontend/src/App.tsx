import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Bell, Menu, X, Home, Package, HelpCircle, Shield, LayoutDashboard } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import CreateShipment from './pages/CreateShipment';
import MyShipment from './pages/MyShipment';
import RecoveryCenter from './pages/RecoveryCenter';
import AdminDashboard from './pages/AdminDashboard';
import HelpCenter from './pages/HelpCenter';
import CustomerDashboard from './pages/CustomerDashboard';
import NotificationCenter from './pages/NotificationCenter';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { useSseClient } from './services/SseClient';
import './i18n/i18n';

// Inner App component to use hooks that require Context/Router
function AppContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { unreadCount } = useNotification();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // For demo, assume customer ID 1 is the logged-in user viewing tracking
  useSseClient(1);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi');
  };

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/tracking', label: t('nav.tracking'), icon: Package },
    { to: '/help', label: t('nav.help'), icon: HelpCircle },
    { to: '/admin', label: t('nav.admin'), icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <header className="border-b bg-card py-4 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-primary text-white font-black text-2xl px-3 py-1 rounded-xl italic tracking-tighter shadow-md shadow-primary/20">
              VIETTEL POST
            </div>
            <span className="font-bold text-muted-foreground hidden lg:inline">| SARS</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 font-semibold text-sm">
            {navLinks.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                className={`hover:text-primary transition-all duration-200 ${
                  location.pathname === link.to ? 'text-primary scale-105' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Notification Bell */}
            <Link 
              to="/notifications" 
              className="relative p-2.5 text-muted-foreground hover:bg-muted rounded-xl transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white ring-2 ring-card animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 border rounded-xl hover:bg-muted transition-all duration-200 text-xs font-bold"
            >
              <Globe size={14} />
              {i18n.language.toUpperCase()}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-muted-foreground hover:bg-muted rounded-xl transition-all duration-200 md:hidden"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[73px] z-30 bg-background/95 backdrop-blur-md md:hidden animate-in slide-in-from-top duration-300 border-b shadow-lg">
          <nav className="container mx-auto px-6 py-8 flex flex-col gap-4 font-semibold text-lg">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 ${
                    location.pathname === link.to 
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon size={20} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<CreateShipment />} />
          <Route path="/tracking" element={<MyShipment />} />
          <Route path="/recovery/:caseId" element={<RecoveryCenter />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/notifications" element={<NotificationCenter />} />
        </Routes>
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8 text-center text-sm text-muted-foreground mt-auto">
        <p className="container mx-auto px-4">
          {t('footer.copyright', { defaultValue: '© 2026 Viettel Post - Smart Adaptive Recovery System Demo.' })}
        </p>
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
