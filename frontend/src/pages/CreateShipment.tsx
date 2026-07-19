import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Box, ShieldCheck, UserRound } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import api from '../services/api';
import { buildDemoShipment } from '../services/demoData';

export default function CreateShipment() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    senderName: 'Nguyễn Văn A',
    senderPhone: '0901234567',
    receiverName: 'Trần Thị B',
    receiverPhone: '0909876543',
    customerType: 'ONLINE_SHOPPER',
    parcelCategory: 'COMMERCIAL_GOODS',
    insuranceStatus: 'INSURED',
    declaredValue: '2500000',
    shippingFee: '35000',
  });

  const isVi = i18n.language === 'vi';

  const customerTypes = useMemo(() => [
    { value: 'ONLINE_SHOPPER', label: isVi ? 'Người mua sắm trực tuyến' : 'Online shopper' },
    { value: 'ONLINE_MERCHANT', label: isVi ? 'Thương nhân trực tuyến' : 'Online merchant' },
    { value: 'INDIVIDUAL_SENDER', label: isVi ? 'Người gửi cá nhân' : 'Individual sender' },
  ], [isVi]);

  const parcelCategories = useMemo(() => [
    { value: 'COMMERCIAL_GOODS', label: isVi ? 'Hàng hóa thương mại' : 'Commercial goods' },
    { value: 'DOCUMENTS', label: isVi ? 'Tài liệu / Giấy tờ' : 'Documents' },
    { value: 'ELECTRONICS', label: isVi ? 'Đồ điện tử / Công nghệ' : 'Electronics' },
  ], [isVi]);

  const insuranceOptions = useMemo(() => [
    { value: 'INSURED', label: isVi ? 'Có bảo hiểm' : 'Insured' },
    { value: 'NOT_INSURED', label: isVi ? 'Không bảo hiểm' : 'Not insured' },
  ], [isVi]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      declaredValue: Number(form.declaredValue),
      shippingFee: Number(form.shippingFee),
    };

    try {
      const response = await api.post('/shipments', payload);
      const shipment = response.data?.data ?? buildDemoShipment(payload as never);
      navigate(`/tracking?trackingId=${shipment.trackingId}`);
    } catch (error) {
      console.error(error);
      const fallbackShipment = buildDemoShipment(payload as never);
      navigate(`/tracking?trackingId=${fallbackShipment.trackingId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{t('nav.create')}</p>
        <h1 className="text-3xl font-bold text-foreground">{t('create.title')}</h1>
        <p className="mt-3 text-muted-foreground">{t('create.subtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Box size={18} className="text-primary" />
              {t('create.shipmentDetails')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  <span className="flex items-center gap-2"><UserRound size={14} /> {t('create.senderName')}</span>
                  <input className="w-full rounded-xl border border-input bg-background px-3 py-2" value={form.senderName} onChange={(e) => setForm({ ...form, senderName: e.target.value })} />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span className="flex items-center gap-2"><UserRound size={14} /> {t('create.senderPhone')}</span>
                  <input className="w-full rounded-xl border border-input bg-background px-3 py-2" value={form.senderPhone} onChange={(e) => setForm({ ...form, senderPhone: e.target.value })} />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  <span>{t('create.receiverName')}</span>
                  <input className="w-full rounded-xl border border-input bg-background px-3 py-2" value={form.receiverName} onChange={(e) => setForm({ ...form, receiverName: e.target.value })} />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>{t('create.receiverPhone')}</span>
                  <input className="w-full rounded-xl border border-input bg-background px-3 py-2" value={form.receiverPhone} onChange={(e) => setForm({ ...form, receiverPhone: e.target.value })} />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  <span>{t('create.customerType')}</span>
                  <select className="w-full rounded-xl border border-input bg-background px-3 py-2" value={form.customerType} onChange={(e) => setForm({ ...form, customerType: e.target.value })}>
                    {customerTypes.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>{t('create.parcelCategory')}</span>
                  <select className="w-full rounded-xl border border-input bg-background px-3 py-2" value={form.parcelCategory} onChange={(e) => setForm({ ...form, parcelCategory: e.target.value })}>
                    {parcelCategories.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  <span>{t('create.insurance')}</span>
                  <select className="w-full rounded-xl border border-input bg-background px-3 py-2" value={form.insuranceStatus} onChange={(e) => setForm({ ...form, insuranceStatus: e.target.value })}>
                    {insuranceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>{t('create.declaredValue')}</span>
                  <input type="number" className="w-full rounded-xl border border-input bg-background px-3 py-2" value={form.declaredValue} onChange={(e) => setForm({ ...form, declaredValue: e.target.value })} />
                </label>
              </div>

              <label className="space-y-2 text-sm font-medium block">
                <span>{t('create.shippingFee')}</span>
                <input type="number" className="w-full rounded-xl border border-input bg-background px-3 py-2" value={form.shippingFee} onChange={(e) => setForm({ ...form, shippingFee: e.target.value })} />
              </label>

              <Button type="submit" className="w-full rounded-xl py-6 font-bold text-base" disabled={loading}>
                {loading ? t('create.creating') : t('create.createShipment')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-muted/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <ShieldCheck size={18} className="text-secondary" />
              {t('create.whatHappensNext')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-xl border border-border bg-background/80 p-4">
              <p className="font-semibold text-foreground">{t('create.instantTracking')}</p>
              <p className="mt-2">{t('create.instantTrackingDesc')}</p>
            </div>
            <div className="rounded-xl border border-border bg-background/80 p-4">
              <p className="font-semibold text-foreground">{t('create.autoRecovery')}</p>
              <p className="mt-2">{t('create.autoRecoveryDesc')}</p>
            </div>
            <div className="rounded-xl border border-border bg-background/80 p-4">
              <p className="font-semibold text-foreground">{t('create.recoveryOptions')}</p>
              <p className="mt-2">{t('create.recoveryOptionsDesc')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
