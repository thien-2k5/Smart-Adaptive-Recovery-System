import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Box, ShieldAlert, Zap, Search, LifeBuoy, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[calc(100vh-73px)]">
      <section className="bg-gradient-to-br from-primary to-[#b30026] px-4 py-20 text-center text-white flex flex-col items-center justify-center flex-1">
        <h1 className="mb-6 max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl">
          {t('landing.title')}
        </h1>
        <p className="mb-10 max-w-2xl text-lg opacity-90 md:text-2xl">
          {t('landing.subtitle')}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" variant="secondary" className="px-8 py-6 text-lg font-bold" onClick={() => navigate('/create')}>
            {t('landing.start')}
          </Button>
          <Button size="lg" variant="outline" className="border-white bg-transparent px-8 py-6 text-lg text-white hover:bg-white hover:text-primary" onClick={() => navigate('/tracking?trackingId=VTP240719A1B2C')}>
            Track existing parcel
          </Button>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">Why SARS?</h2>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-none shadow-md transition-shadow hover:shadow-lg">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Zap size={32} />
                </div>
                <h3 className="mb-3 text-xl font-bold">Proactive detection</h3>
                <p className="text-muted-foreground">Automatically identifies parcels stuck at sorting hubs before customers complain.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md transition-shadow hover:shadow-lg">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <ShieldAlert size={32} />
                </div>
                <h3 className="mb-3 text-xl font-bold">Adaptive recovery</h3>
                <p className="text-muted-foreground">Tailors the recovery process based on the customer profile and parcel category.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md transition-shadow hover:shadow-lg">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <Box size={32} />
                </div>
                <h3 className="mb-3 text-xl font-bold">Real-time visibility</h3>
                <p className="text-muted-foreground">Customers receive instant alerts and full transparency over the investigation.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container mx-auto grid gap-6 px-4 md:grid-cols-3">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2 text-primary"><Search size={18} /> <span className="font-semibold">Tracking</span></div>
              <p className="text-sm text-muted-foreground">Follow a shipment from creation to delivery and view its live timeline.</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2 text-secondary"><LifeBuoy size={18} /> <span className="font-semibold">Help center</span></div>
              <p className="text-sm text-muted-foreground">Read policy guidance, FAQs, and recovery instructions in both languages.</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2 text-primary"><LayoutDashboard size={18} /> <span className="font-semibold">Admin dashboard</span></div>
              <p className="text-sm text-muted-foreground">Review case volume, abnormal events, and customer impact at a glance.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
