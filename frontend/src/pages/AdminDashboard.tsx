import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Activity, BellRing, Box, FileSearch, LayoutDashboard,
  ShieldAlert, Users, Clock, CheckCircle, Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { buildDemoAdminStats } from '../services/demoData';

interface AdminCase {
  caseId: string;
  trackingId: string;
  customerType: string;
  recoveryMode: string;
  investigationStatus: string;
  declaredValue: number;
}

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState(() => buildDemoAdminStats());
  const [activeCases, setActiveCases] = useState<AdminCase[]>(() => [
    {
      caseId: 'RC240719X1Y2Z',
      trackingId: 'VTP240719A1B2C',
      customerType: 'ONLINE_SHOPPER',
      recoveryMode: 'FAST_REPLACEMENT_REFUND',
      investigationStatus: 'IN_PROGRESS',
      declaredValue: 2500000,
    },
    {
      caseId: 'RC240719M2N3P',
      trackingId: 'VTP240719D3E4F',
      customerType: 'ONLINE_MERCHANT',
      recoveryMode: 'STANDARD_SUPPORT',
      investigationStatus: 'IN_PROGRESS',
      declaredValue: 1200000,
    },
    {
      caseId: 'RC240718M7N8O',
      trackingId: 'VTP240718G5H6I',
      customerType: 'INDIVIDUAL_SENDER',
      recoveryMode: 'NONE',
      investigationStatus: 'RESOLVED',
      declaredValue: 800000,
    }
  ]);

  const metrics = useMemo(() => [
    { label: t('admin.totalShipments'), value: stats.totalShipments, icon: Box, color: 'text-primary bg-primary/10' },
    { label: t('admin.activeShipments'), value: stats.activeShipments, icon: Activity, color: 'text-blue-600 bg-blue-500/10' },
    { label: t('admin.abnormalEvents'), value: stats.abnormalEvents, icon: ShieldAlert, color: 'text-amber-600 bg-amber-500/10' },
    { label: t('admin.recoveryCases'), value: stats.recoveryCases.total, icon: FileSearch, color: 'text-secondary bg-secondary/10' },
  ], [stats, t]);

  const handleSimulateDelay = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newCase: AdminCase = {
      caseId: `RC240720X${randomNum}`,
      trackingId: `VTP240720A${randomNum}`,
      customerType: 'ONLINE_SHOPPER',
      recoveryMode: 'FAST_REPLACEMENT_REFUND',
      investigationStatus: 'IN_PROGRESS',
      declaredValue: 1500000,
    };
    setActiveCases(prev => [newCase, ...prev]);
    setStats(prev => ({
      ...prev,
      abnormalEvents: prev.abnormalEvents + 1,
      recoveryCases: {
        ...prev.recoveryCases,
        total: prev.recoveryCases.total + 1,
        inProgress: prev.recoveryCases.inProgress + 1,
      }
    }));
  };

  const handleResolveCase = (caseId: string) => {
    setActiveCases(prev => prev.map(c => c.caseId === caseId ? { ...c, investigationStatus: 'RESOLVED' } : c));
    setStats(prev => ({
      ...prev,
      recoveryCases: {
        ...prev.recoveryCases,
        inProgress: Math.max(0, prev.recoveryCases.inProgress - 1),
        resolved: prev.recoveryCases.resolved + 1,
      }
    }));
  };

  const isVi = i18n.language === 'vi';

  return (
    <div className="container mx-auto px-4 py-10 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{t('nav.admin')}</p>
          <h1 className="text-3xl font-bold text-foreground">{t('admin.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('admin.subtitle')}</p>
        </div>
        <Button onClick={handleSimulateDelay} className="gap-2 self-start md:self-auto bg-primary hover:bg-primary/95 text-white">
          <Play size={16} />
          {isVi ? 'Mô phỏng sự cố chậm trễ' : 'Simulate Abnormal Delay'}
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{item.value}</p>
                </div>
                <div className={`rounded-2xl p-3 ${item.color}`}>
                  <Icon size={22} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Health & Customer Mix */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] mb-6">
        
        {/* Recovery Health */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <LayoutDashboard size={18} className="text-primary" />
              {t('admin.recoveryHealth')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 grid-cols-3">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">{t('admin.inProgress')}</p>
                <p className="mt-2 text-xl font-bold text-amber-600">{stats.recoveryCases.inProgress}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">{t('admin.resolved')}</p>
                <p className="mt-2 text-xl font-bold text-emerald-600">{stats.recoveryCases.resolved}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">{t('admin.notificationsSent')}</p>
                <p className="mt-2 text-xl font-bold text-primary">{stats.notificationsSent}</p>
              </div>
            </div>

            {/* Health Indicators */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-semibold text-sm text-foreground">{t('admin.systemHealth')}</h4>
              <div className="grid gap-4 grid-cols-2">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('admin.avgResolution')}</p>
                    <p className="text-sm font-bold text-foreground">6.5 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('admin.successRate')}</p>
                    <p className="text-sm font-bold text-foreground">94.8%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Mix */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Users size={18} className="text-secondary" />
              {t('admin.customerMix')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/40 p-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('admin.totalCustomers')}</span>
              <span className="text-xl font-bold text-foreground">{stats.customerStats.totalCustomers}</span>
            </div>
            
            <div className="grid gap-3 grid-cols-3">
              <div className="rounded-xl border border-border bg-background p-4 text-center">
                <p className="text-xs text-muted-foreground">{t('admin.onlineShoppers')}</p>
                <p className="mt-2 font-bold text-foreground">{stats.customerStats.onlineShoppers}</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4 text-center">
                <p className="text-xs text-muted-foreground">{t('admin.merchants')}</p>
                <p className="mt-2 font-bold text-foreground">{stats.customerStats.onlineMerchants}</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4 text-center">
                <p className="text-xs text-muted-foreground">{t('admin.individualSenders')}</p>
                <p className="mt-2 font-bold text-foreground">{stats.customerStats.individualSenders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Recovery Cases List */}
      <Card className="border-none shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <ShieldAlert size={18} className="text-primary" />
            {t('admin.recentCases')}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b text-muted-foreground font-semibold">
                <th className="py-3 px-4">{t('recovery.caseId')}</th>
                <th className="py-3 px-4">{t('recovery.trackingId')}</th>
                <th className="py-3 px-4">{t('create.customerType')}</th>
                <th className="py-3 px-4">{t('recovery.recoveryMode')}</th>
                <th className="py-3 px-4">{t('common.status')}</th>
                <th className="py-3 px-4 text-right">{t('common.confirm')}</th>
              </tr>
            </thead>
            <tbody>
              {activeCases.map((c) => (
                <tr key={c.caseId} className="border-b last:border-none hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-primary">{c.caseId}</td>
                  <td className="py-4 px-4 font-mono">{c.trackingId}</td>
                  <td className="py-4 px-4 text-muted-foreground">{c.customerType.replace(/_/g, ' ')}</td>
                  <td className="py-4 px-4 text-muted-foreground">{c.recoveryMode.replace(/_/g, ' ')}</td>
                  <td className="py-4 px-4">
                    <Badge variant={c.investigationStatus === 'RESOLVED' ? 'success' : 'warning'}>
                      {c.investigationStatus}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {c.investigationStatus === 'IN_PROGRESS' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolveCase(c.caseId)}
                        className="h-8 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700"
                      >
                        Resolve
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground font-medium flex items-center justify-end gap-1">
                        <CheckCircle size={12} className="text-emerald-500" />
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Compensation Overview */}
      <Card className="border-none shadow-lg border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <BellRing size={18} className="text-primary" />
            {t('admin.compensationOverview')}
          </CardTitle>
        </CardHeader>
        <CardContent className="rounded-xl bg-muted/40 p-6 text-sm text-muted-foreground">
          {t('admin.compensationDesc', { amount: stats.compensationTotal.toLocaleString('vi-VN') })}
        </CardContent>
      </Card>
    </div>
  );
}
