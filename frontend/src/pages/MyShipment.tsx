import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Package, Route, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { buildDemoShipment, buildDemoTracking } from '../services/demoData';

export default function MyShipment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(() => buildDemoShipment());
  const [tracking, setTracking] = useState(() => buildDemoTracking('VTP240719A1B2C'));

  const trackingId = useMemo(() => new URLSearchParams(location.search).get('trackingId') ?? shipment.trackingId, [location.search, shipment.trackingId]);

  useEffect(() => {
    setShipment((current) => ({ ...current, trackingId }));
    setTracking(buildDemoTracking(trackingId));
  }, [trackingId]);

  return (
    <div className="container mx-auto px-4 py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Tracking</p>
          <h1 className="text-3xl font-bold text-foreground">Shipment timeline</h1>
          <p className="mt-2 text-muted-foreground">Watch the parcel progress and open the recovery flow if an abnormal delay is detected.</p>
        </div>
        <div className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-muted-foreground">
          Tracking ID: {trackingId}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package size={18} className="text-primary" />
              Shipment summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="mt-1 font-semibold text-foreground">{tracking.currentStatus}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Recovery mode</p>
                <p className="mt-1 font-semibold text-foreground">{shipment.recoveryMode}</p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background/80 p-4">
              <div className="flex items-center gap-2 text-secondary">
                <Truck size={16} />
                <span className="font-semibold">Current route</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">The parcel is currently held at the sorting hub while the system monitors for abnormal delay.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route size={18} className="text-secondary" />
              Tracking history
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tracking.timeline.map((item, index) => (
              <div key={`${item.status}-${index}`} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`mt-1 h-3 w-3 rounded-full ${item.isCurrent ? 'bg-primary' : 'bg-secondary'}`} />
                  {index < tracking.timeline.length - 1 && <div className="mt-1 h-full w-px bg-border" />}
                </div>
                <div className="flex-1 rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-foreground">{item.status}</p>
                    {item.isCurrent ? <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">Current</span> : null}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.location}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {tracking.abnormalEvent ? (
        <Card className="mt-6 border border-destructive/20 bg-destructive/5 shadow-none">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 text-destructive" size={20} />
              <div>
                <p className="font-semibold text-foreground">Abnormal delay detected</p>
                <p className="text-sm text-muted-foreground">The parcel remained at the current stage for {tracking.abnormalEvent.delayMinutes} minutes.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate(`/recovery/${tracking.recoveryCase?.caseId ?? 'RC240719X1Y2Z'}`)}>
                Open recovery center
              </Button>
              <Button className="bg-secondary hover:bg-secondary/90">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Review case
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
