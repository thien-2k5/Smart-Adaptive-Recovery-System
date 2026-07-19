import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DelayAlert {
  caseId: string;
  title: string;
  message: string;
}

interface NotificationContextType {
  triggerAlert: (alert: DelayAlert) => void;
  clearAlert: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [activeAlert, setActiveAlert] = useState<DelayAlert | null>(null);
  const navigate = useNavigate();

  const triggerAlert = (alert: DelayAlert) => {
    setActiveAlert(alert);
    // Play sound if possible
    try {
      const audio = new Audio('/alert.mp3'); // Assuming we have an alert.mp3 in public
      audio.play().catch(e => console.log('Audio play blocked by browser', e));
    } catch(e) {}
  };

  const clearAlert = () => setActiveAlert(null);

  const handleViewCase = () => {
    if (activeAlert) {
      navigate(`/recovery/${activeAlert.caseId}`);
      clearAlert();
    }
  };

  return (
    <NotificationContext.Provider value={{ triggerAlert, clearAlert }}>
      {children}
      
      {/* FULL SCREEN ALERT MODAL */}
      {activeAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card text-card-foreground w-11/12 max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-destructive text-destructive-foreground p-6 flex flex-col items-center justify-center">
              <div className="bg-white/20 p-4 rounded-full mb-4 animate-pulse-fast">
                <AlertTriangle size={48} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-center">{activeAlert.title}</h2>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground mb-6 text-center text-lg">
                {activeAlert.message}
              </p>
              
              <div className="bg-muted p-4 rounded-lg mb-6 flex justify-between items-center">
                <span className="text-sm font-medium">Recovery Case ID:</span>
                <span className="font-mono font-bold text-primary">{activeAlert.caseId}</span>
              </div>
              
              <Button size="lg" className="w-full text-lg group" onClick={handleViewCase}>
                View Recovery Center
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
