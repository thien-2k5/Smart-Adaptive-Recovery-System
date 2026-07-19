import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Package, Plus, Search, Bell, AlertTriangle, CheckCircle2,
  Truck, ArrowRight, Clock, TrendingUp, ShieldCheck
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { buildDemoShipment, buildDemoRecoveryCase } from '../services/demoData';

export default function CustomerDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [shipments] = useState(() => [
    buildDemoShipment(),
    buildDemoShipment({
      id: 2, trackingId: 'VTP240719D3E4F', currentStatus: 'IN_TRANSIT',
      receiverName: 'Lê Văn C', recoveryMode: 'STANDARD_SUPPORT',
      declaredValue: 1200000, shippingFee: 25000,
    }),
    buildDemoShipment({
      id: 3, trackingId: 'VTP240718G5H6I', currentStatus: 'DELIVERED',
      senderName: 'Phạm Thị D', receiverName: 'Hoàng Văn E',
      recoveryMode: 'NONE', declaredValue: 800000, shippingFee: 18000,
    }),
  ]);
  const [recoveryCase] = useState(() => buildDemoRecoveryCase());

  const statusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'success' as const;
      case 'IN_TRANSIT': return 'secondary' as const;
      case 'AT_SORTING_HUB': return 'warning' as const;
      default: return 'destructive' as const;
    }
  };

  const stats = [
    { label: t('dashboard.totalOrders'), value: shipments.length, icon: Package, color: 'text-primary bg-primary/10' },
    { label: t('dashboard.delivered'), value: shipments.filter(s => s.currentStatus === 'DELIVERED').length, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-500/10' },
    { label: t('dashboard.inTransit'), value: shipments.filter(s => s.currentStatus === 'IN_TRANSIT').length, icon: Truck, color: 'text-blue-600 bg-blue-500/10' },
    { label: t('dashboard.issues'), value: shipments.filter(s => s.currentStatus === 'ABNORMAL_DELAY_DETECTED' || s.currentStatus === 'AT_SORTING_HUB').length, icon: AlertTriangle, color: 'text-amber-600 bg-amber-500/10' },
  ];

  return (
    <div className="container mx-auto px-4 py-10 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{t('nav.dashboard')}</p>
          <h1 className="text-3xl font-bold text-foreground">{t('dashboard.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>
        <Button onClick={() => navigate('/create')} className="gap-2 self-start md:self-auto">
          <Plus size={16} />
          {t('dashboard.createShipment')}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1.5 text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={22} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* My Shipments */}
        <Card className="border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package size={18} className="text-primary" />
              {t('dashboard.myShipments')}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/tracking')} className="gap-1 text-muted-foreground hover:text-foreground">
              {t('dashboard.viewAll')}
              <ArrowRight size={14} />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {shipments.map((shipment) => (
              <div
                key={shipment.id}
                className="group flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4 hover:bg-muted/60 transition-colors cursor-pointer"
                onClick={() => navigate(`/tracking?trackingId=${shipment.trackingId}`)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <Package size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{shipment.trackingId}</p>
                    <p className="text-sm text-muted-foreground truncate">{shipment.receiverName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={statusColor(shipment.currentStatus)}>
                    {shipment.currentStatus.replace(/_/g, ' ')}
                  </Badge>
                  <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Active Recovery */}
          <Card className="border-none shadow-lg border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck size={18} className="text-primary" />
                {t('dashboard.activeRecovery')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-destructive/10 p-2">
                    <AlertTriangle size={16} className="text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{recoveryCase.caseId}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {recoveryCase.trackingId} • {recoveryCase.recoveryMode.replace(/_/g, ' ')}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="warning">{recoveryCase.investigationStatus}</Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={12} />
                        {recoveryCase.estimatedResolutionHours}h
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline" size="sm" className="w-full mt-4 gap-2"
                  onClick={() => navigate(`/recovery/${recoveryCase.caseId}`)}
                >
                  {t('tracking.openRecovery')}
                  <ArrowRight size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp size={18} className="text-secondary" />
                {t('dashboard.quickActions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              <button
                onClick={() => navigate('/create')}
                className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 hover:bg-primary/5 hover:border-primary/30 transition-colors text-left"
              >
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Plus size={18} />
                </div>
                <span className="text-sm font-medium text-foreground">{t('dashboard.createShipment')}</span>
              </button>
              <button
                onClick={() => navigate('/tracking')}
                className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 hover:bg-secondary/5 hover:border-secondary/30 transition-colors text-left"
              >
                <div className="rounded-lg bg-secondary/10 p-2 text-secondary">
                  <Search size={18} />
                </div>
                <span className="text-sm font-medium text-foreground">{t('dashboard.viewTracking')}</span>
              </button>
              <button
                onClick={() => navigate('/notifications')}
                className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 hover:bg-blue-500/5 hover:border-blue-500/30 transition-colors text-left"
              >
                <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
                  <Bell size={18} />
                </div>
                <span className="text-sm font-medium text-foreground">{t('nav.notifications')}</span>
              </button>
              <button
                onClick={() => navigate('/help')}
                className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 hover:bg-amber-500/5 hover:border-amber-500/30 transition-colors text-left"
              >
                <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-sm font-medium text-foreground">{t('dashboard.viewHelp')}</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
