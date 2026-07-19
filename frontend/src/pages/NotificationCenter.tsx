import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Bell, BellOff, CheckCheck, Trash2, AlertTriangle,
  Package, Info, ArrowRight, Clock
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useNotification, type NotificationItem } from '../context/NotificationContext';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'delay': return AlertTriangle;
    case 'update': return Package;
    case 'resolved': return CheckCheck;
    default: return Info;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'delay': return 'text-destructive bg-destructive/10';
    case 'update': return 'text-primary bg-primary/10';
    case 'resolved': return 'text-emerald-600 bg-emerald-500/10';
    default: return 'text-blue-600 bg-blue-500/10';
  }
};

const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export default function NotificationCenter() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAllRead, markRead, clearAll } = useNotification();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications;

  const todayNotifications = filtered.filter(n => {
    const diff = Date.now() - new Date(n.createdAt).getTime();
    return diff < 86400000;
  });
  const earlierNotifications = filtered.filter(n => {
    const diff = Date.now() - new Date(n.createdAt).getTime();
    return diff >= 86400000;
  });

  const handleClick = (notification: NotificationItem) => {
    markRead(notification.id);
    if (notification.caseId) {
      navigate(`/recovery/${notification.caseId}`);
    } else if (notification.trackingId) {
      navigate(`/tracking?trackingId=${notification.trackingId}`);
    }
  };

  const renderNotification = (notification: NotificationItem) => {
    const Icon = getNotificationIcon(notification.type);
    const colorClass = getNotificationColor(notification.type);

    return (
      <div
        key={notification.id}
        className={`group flex gap-4 rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
          notification.isRead
            ? 'border-border bg-muted/20 hover:bg-muted/40'
            : 'border-primary/20 bg-primary/5 hover:bg-primary/10'
        }`}
        onClick={() => handleClick(notification)}
      >
        <div className={`mt-0.5 rounded-xl p-2.5 shrink-0 ${colorClass}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`font-semibold text-foreground ${!notification.isRead ? 'text-primary' : ''}`}>
              {notification.title}
            </p>
            {!notification.isRead && (
              <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-primary shrink-0" />
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={12} />
              {formatRelativeTime(notification.createdAt)}
            </span>
            {notification.trackingId && (
              <Badge variant="outline" className="text-xs">
                {notification.trackingId}
              </Badge>
            )}
          </div>
        </div>
        <ArrowRight size={16} className="mt-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-10 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{t('nav.notifications')}</p>
          <h1 className="text-3xl font-bold text-foreground">{t('notifications.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('notifications.subtitle')}</p>
        </div>
        <div className="flex gap-2 self-start md:self-auto">
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0} className="gap-2">
            <CheckCheck size={14} />
            {t('notifications.markAllRead')}
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll} disabled={notifications.length === 0} className="gap-2 text-destructive hover:text-destructive">
            <Trash2 size={14} />
            {t('notifications.clearAll')}
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {t('notifications.all')} ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'unread' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {t('notifications.unread')} ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <Card className="border-none shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <BellOff size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{t('notifications.noNotifications')}</h3>
            <p className="mt-2 max-w-md text-muted-foreground">{t('notifications.noNotificationsDesc')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {todayNotifications.length > 0 && (
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell size={18} className="text-primary" />
                  {t('notifications.today')}
                  {unreadCount > 0 && (
                    <Badge variant="default" className="ml-1">{unreadCount}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayNotifications.map(renderNotification)}
              </CardContent>
            </Card>
          )}

          {earlierNotifications.length > 0 && (
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-muted-foreground">
                  <Clock size={18} />
                  {t('notifications.earlier')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {earlierNotifications.map(renderNotification)}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
