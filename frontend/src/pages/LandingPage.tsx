import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Box, ShieldAlert, Zap, Search, LifeBuoy, LayoutDashboard, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap, color: 'bg-primary/10 text-primary',
      title: t('landing.proactiveTitle'), desc: t('landing.proactiveDesc'),
    },
    {
      icon: ShieldAlert, color: 'bg-secondary/10 text-secondary',
      title: t('landing.adaptiveTitle'), desc: t('landing.adaptiveDesc'),
    },
    {
      icon: Box, color: 'bg-blue-500/10 text-blue-500',
      title: t('landing.realtimeTitle'), desc: t('landing.realtimeDesc'),
    },
  ];

  const quickLinks = [
    { icon: Search, color: 'text-primary', title: t('landing.trackingFeature'), desc: t('landing.trackingFeatureDesc'), to: '/tracking' },
    { icon: LifeBuoy, color: 'text-secondary', title: t('landing.helpFeature'), desc: t('landing.helpFeatureDesc'), to: '/help' },
    { icon: LayoutDashboard, color: 'text-primary', title: t('landing.adminFeature'), desc: t('landing.adminFeatureDesc'), to: '/admin' },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-73px)]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-[#cc002b] to-[#990020] px-4 py-24 text-center text-white flex flex-col items-center justify-center flex-1 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-white/3 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm mb-8 border border-white/10">
            <Sparkles size={16} />
            Viettel Post - SARS Platform
          </div>

          <h1 className="mb-6 max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl leading-tight">
            {t('landing.title')}
          </h1>
          <p className="mb-10 max-w-2xl text-lg opacity-90 md:text-xl lg:text-2xl mx-auto leading-relaxed">
            {t('landing.subtitle')}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-shadow" onClick={() => navigate('/create')}>
              {t('landing.start')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 bg-white/10 backdrop-blur-sm px-8 py-6 text-lg text-white hover:bg-white hover:text-primary transition-all" onClick={() => navigate('/tracking?trackingId=VTP240719A1B2C')}>
              {t('landing.trackExisting')}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground">{t('landing.whySars')}</h2>
          <p className="mb-12 text-center text-muted-foreground max-w-2xl mx-auto">
            {t('landing.subtitle')}
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-none shadow-md transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
                  <CardContent className="flex flex-col items-center p-8 text-center">
                    <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${feature.color}`}>
                      <Icon size={32} />
                    </div>
                    <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="bg-background py-16">
        <div className="container mx-auto grid gap-6 px-4 md:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Card
                key={link.title}
                className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group"
                onClick={() => navigate(link.to)}
              >
                <CardContent className="p-6">
                  <div className={`mb-3 flex items-center gap-2 ${link.color}`}>
                    <Icon size={18} />
                    <span className="font-semibold">{link.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{link.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('common.viewDetails')}
                    <ArrowRight size={14} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
