import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle, Package, Route, ShieldCheck, Truck,
  Search, User, DollarSign, Shield, Calendar, Clock,
  MapPin, CheckCircle2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { buildDemoShipment, buildDemoTracking } from '../services/demoData';
import api from '../services/api';

export default function MyShipment() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [shipment, setShipment] = useState(() => buildDemoShipment());
  const [tracking, setTracking] = useState(() => buildDemoTracking('VTP240719A1B2C'));
  const [loading, setLoading] = useState(false);

  const trackingId = new URLSearchParams(location.search).get('trackingId') ?? shipment.trackingId;

  useEffect(() => {
    setSearchInput(trackingId);
    loadTracking(trackingId);
  }, [trackingId]);

  const loadTracking = async (id: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/shipments/${id}`);
      if (response.data?.data) {
        setShipment(response.data.data);
      }
    } catch {
      // Use demo data as fallback
      setShipment(buildDemoShipment({ trackingId: id }));
    }
    setTracking(buildDemoTracking(id));
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/tracking?trackingId=${searchInput.trim()}`);
    }
  };

  const statusIcon = (status: string, isCurrent: boolean) => {
    if (status.includes('ABNORMAL') || status.includes('DELAY')) return <AlertTriangle size={14} className="text-destructive" />;
    if (isCurrent) return <Clock size={14} className="text-primary" />;
    return <CheckCircle2 size={14} className="text-secondary" />;
  };

  const formatValue = (value: number) => value.toLocaleString('vi-VN') + ' ₫';

  return (
    <div className="container mx-auto px-4 py-10 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{t('nav.tracking')}</p>
        <h1 className="text-3xl font-bold text-foreground">{t('tracking.title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('tracking.subtitle')}</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('tracking.searchPlaceholder')}
              className="w-full rounded-xl border border-input bg-background pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
          <Button type="submit" className="px-6 rounded-xl" disabled={loading}>
            <Search size={16} className="mr-2" />
            {t('tracking.search')}
          </Button>
        </div>
      </form>

      {/* Tracking ID Badge */}
      <div className="mb-6 flex items-center gap-3">
        <Badge variant="outline" className="py-1.5 px-4 text-sm font-semibold">
          Tracking ID: {trackingId}
        </Badge>
        <Badge variant={tracking.currentStatus.includes('ABNORMAL') ? 'destructive' : 'secondary'}>
          {tracking.currentStatus.replace(/_/g, ' ')}
        </Badge>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Shipment Summary */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package size={18} className="text-primary" />
                  {t('tracking.shipmentSummary')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status & Recovery Mode */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-muted/40 p-4">
                    <p className="text-sm text-muted-foreground">{t('tracking.status')}</p>
                    <p className="mt-1 font-semibold text-foreground">{tracking.currentStatus.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/40 p-4">
                    <p className="text-sm text-muted-foreground">{t('tracking.recoveryMode')}</p>
                    <p className="mt-1 font-semibold text-foreground">{shipment.recoveryMode.replace(/_/g, ' ')}</p>
                  </div>
                </div>

                {/* Sender/Receiver */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-background/80 p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <User size={14} />
                      <span className="text-sm font-medium">{t('tracking.sender')}</span>
                    </div>
                    <p className="font-semibold text-foreground">{shipment.senderName}</p>
                    <p className="text-sm text-muted-foreground">{shipment.senderPhone}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/80 p-4">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <User size={14} />
                      <span className="text-sm font-medium">{t('tracking.receiver')}</span>
                    </div>
                    <p className="font-semibold text-foreground">{shipment.receiverName}</p>
                    <p className="text-sm text-muted-foreground">{shipment.receiverPhone}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                    <DollarSign size={16} className="text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('tracking.value')}</p>
                      <p className="text-sm font-semibold">{formatValue(shipment.declaredValue)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                    <Shield size={16} className="text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('tracking.insurance')}</p>
                      <p className="text-sm font-semibold">{shipment.insuranceStatus}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                    <Calendar size={16} className="text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('tracking.fee')}</p>
                      <p className="text-sm font-semibold">{formatValue(shipment.shippingFee)}</p>
                    </div>
                  </div>
                </div>

                {/* Current Route */}
                <div className="rounded-xl border border-border bg-secondary/5 p-4">
                  <div className="flex items-center gap-2 text-secondary">
                    <Truck size={16} />
                    <span className="font-semibold">{t('tracking.currentRoute')}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{t('tracking.currentRouteDesc')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Tracking History */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route size={18} className="text-secondary" />
                  {t('tracking.trackingHistory')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {tracking.timeline.map((item, index) => (
                  <div key={`${item.status}-${index}`} className="flex gap-4">
                    {/* Timeline connector */}
                    <div className="flex flex-col items-center">
                      <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        item.isCurrent ? 'border-primary bg-primary/10' : item.status.includes('ABNORMAL') ? 'border-destructive bg-destructive/10' : 'border-secondary bg-secondary/10'
                      }`}>
                        {statusIcon(item.status, item.isCurrent)}
                      </div>
                      {index < tracking.timeline.length - 1 && (
                        <div className="my-1 h-full w-0.5 bg-border" />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 rounded-xl border p-4 mb-3 ${
                      item.isCurrent ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/20'
                    }`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-foreground">{item.status.replace(/_/g, ' ')}</p>
                        {item.isCurrent && (
                          <Badge variant="default" className="text-xs">{t('tracking.current')}</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={12} />
                        {item.location}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Abnormal Event Alert */}
          {tracking.abnormalEvent && (
            <Card className="mt-6 border border-destructive/20 bg-gradient-to-r from-destructive/5 to-transparent shadow-none">
              <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-destructive/10 p-2.5">
                    <AlertTriangle className="text-destructive" size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t('tracking.abnormalDetected')}</p>
                    <p className="text-sm text-muted-foreground">{t('tracking.abnormalDesc', { minutes: tracking.abnormalEvent.delayMinutes })}</p>
                  </div>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Button variant="outline" onClick={() => navigate(`/recovery/${tracking.recoveryCase?.caseId ?? 'RC240719X1Y2Z'}`)}>
                    {t('tracking.openRecovery')}
                  </Button>
                  <Button className="bg-secondary hover:bg-secondary/90" onClick={() => navigate(`/recovery/${tracking.recoveryCase?.caseId ?? 'RC240719X1Y2Z'}`)}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {t('tracking.reviewCase')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
