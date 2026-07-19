import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export interface NotificationItem {
  id: number;
  type: 'delay' | 'update' | 'info' | 'resolved';
  title: string;
  message: string;
  caseId?: string;
  trackingId?: string;
  isRead: boolean;
  createdAt: string;
}

interface DelayAlert {
  caseId: string;
  title: string;
  message: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  triggerAlert: (alert: DelayAlert) => void;
  clearAlert: () => void;
  markAllRead: () => void;
  markRead: (id: number) => void;
  clearAll: () => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'isRead' | 'createdAt'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [activeAlert, setActiveAlert] = useState<DelayAlert | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const navigate = useNavigate();

  // Initialize with some demo notifications
  useEffect(() => {
    const now = new Date();
    setNotifications([
      {
        id: 1,
        type: 'delay',
        title: 'Abnormal delay detected',
        message: 'Your parcel VTP240719A1B2C has been stuck at the sorting hub for longer than expected. A recovery case has been opened.',
        caseId: 'RC240719X1Y2Z',
        trackingId: 'VTP240719A1B2C',
        isRead: false,
        createdAt: new Date(now.getTime() - 1000 * 60 * 5).toISOString(),
      },
      {
        id: 2,
        type: 'update',
        title: 'Investigation update',
        message: 'Warehouse team has started scanning the parcel history for VTP240719A1B2C.',
        caseId: 'RC240719X1Y2Z',
        trackingId: 'VTP240719A1B2C',
        isRead: false,
        createdAt: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: 3,
        type: 'info',
        title: 'Shipment created',
        message: 'Your shipment VTP240719D3E4F has been successfully created and is ready for pickup.',
        trackingId: 'VTP240719D3E4F',
        isRead: true,
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: 4,
        type: 'resolved',
        title: 'Recovery case resolved',
        message: 'Recovery case RC240718M7N8O for parcel VTP240718G5H6I has been successfully resolved. Shipment delivered.',
        caseId: 'RC240718M7N8O',
        trackingId: 'VTP240718G5H6I',
        isRead: true,
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ]);
  }, []);

  const triggerAlert = (alert: DelayAlert) => {
    setActiveAlert(alert);
    
    // Add it to the notifications list
    const newNotif: NotificationItem = {
      id: Date.now(),
      type: 'delay',
      title: alert.title,
      message: alert.message,
      caseId: alert.caseId,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Play sound if possible
    try {
      const audio = new Audio('/alert.mp3');
      audio.play().catch(e => console.log('Audio play blocked by browser', e));
    } catch {}
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'isRead' | 'createdAt'>) => {
    const newNotif: NotificationItem = {
      id: Date.now(),
      ...item,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const clearAlert = () => setActiveAlert(null);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleViewCase = () => {
    if (activeAlert) {
      navigate(`/recovery/${activeAlert.caseId}`);
      clearAlert();
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      triggerAlert,
      clearAlert,
      markAllRead,
      markRead,
      clearAll,
      addNotification
    }}>
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
