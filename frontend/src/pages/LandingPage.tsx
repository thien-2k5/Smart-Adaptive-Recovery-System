import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Search, ShieldAlert, Zap, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-[calc(100vh-73px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-[#b30026] text-white py-20 px-4 text-center flex-1 flex flex-col justify-center items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mb-6">
          {t('landing.title')}
        </h1>
        <p className="text-lg md:text-2xl opacity-90 max-w-2xl mb-10">
          {t('landing.subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6 font-bold" onClick={() => navigate('/create')}>
            {t('landing.start')}
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-white text-white hover:bg-white hover:text-primary">
            Track Existing Parcel
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Why SARS?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                  <Zap size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">Proactive Detection</h3>
                <p className="text-muted-foreground">Automatically identifies parcels stuck at sorting hubs before customers complain.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="h-16 w-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6 text-secondary">
                  <ShieldAlert size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">Adaptive Recovery</h3>
                <p className="text-muted-foreground">Tailors the recovery process based on your profile and parcel category.</p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="h-16 w-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 text-blue-500">
                  <Box size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">Real-time Visibility</h3>
                <p className="text-muted-foreground">Customers receive instant alerts and full transparency over the investigation.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
