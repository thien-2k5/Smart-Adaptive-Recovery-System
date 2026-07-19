import { useMemo, useState } from 'react';
import { Activity, BellRing, Box, FileSearch, LayoutDashboard, ShieldAlert, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { buildDemoAdminStats } from '../services/demoData';

export default function AdminDashboard() {
  const [stats] = useState(() => buildDemoAdminStats());
  const metrics = useMemo(() => [
    { label: 'Total shipments', value: stats.totalShipments, icon: Box },
    { label: 'Active shipments', value: stats.activeShipments, icon: Activity },
    { label: 'Abnormal events', value: stats.abnormalEvents, icon: ShieldAlert },
    { label: 'Recovery cases', value: stats.recoveryCases.total, icon: FileSearch },
  ], [stats]);

  return (
    <div className="container mx-auto px-4 py-10 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Admin dashboard</p>
        <h1 className="text-3xl font-bold text-foreground">Operations overview</h1>
        <p className="mt-2 text-muted-foreground">Monitor parcel health, recovery workload, and customer impact from one place.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="border-none shadow-md">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{item.value}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <Icon size={20} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard size={18} className="text-primary" />
              Recovery health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">In progress</p>
                <p className="mt-2 text-xl font-semibold text-foreground">{stats.recoveryCases.inProgress}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="mt-2 text-xl font-semibold text-foreground">{stats.recoveryCases.resolved}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Notifications sent</p>
                <p className="mt-2 text-xl font-semibold text-foreground">{stats.notificationsSent}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={18} className="text-secondary" />
              Customer mix
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Total customers</p>
              <p className="mt-2 text-xl font-semibold text-foreground">{stats.customerStats.totalCustomers}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-background/80 p-4">
                <p className="text-sm text-muted-foreground">Online shoppers</p>
                <p className="mt-2 font-semibold text-foreground">{stats.customerStats.onlineShoppers}</p>
              </div>
              <div className="rounded-lg border border-border bg-background/80 p-4">
                <p className="text-sm text-muted-foreground">Merchants</p>
                <p className="mt-2 font-semibold text-foreground">{stats.customerStats.onlineMerchants}</p>
              </div>
              <div className="rounded-lg border border-border bg-background/80 p-4">
                <p className="text-sm text-muted-foreground">Individual senders</p>
                <p className="mt-2 font-semibold text-foreground">{stats.customerStats.individualSenders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing size={18} className="text-primary" />
            Compensation overview
          </CardTitle>
        </CardHeader>
        <CardContent className="rounded-lg border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
          Total compensation value currently outstanding is {stats.compensationTotal.toLocaleString('vi-VN')} VND.
        </CardContent>
      </Card>
    </div>
  );
}
