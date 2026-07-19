import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Box, ShieldCheck, UserRound } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import api from '../services/api';
import { buildDemoShipment } from '../services/demoData';

const customerTypes = [
  { value: 'ONLINE_SHOPPER', label: 'Online shopper' },
  { value: 'ONLINE_MERCHANT', label: 'Online merchant' },
  { value: 'INDIVIDUAL_SENDER', label: 'Individual sender' },
];

const parcelCategories = [
  { value: 'COMMERCIAL_GOODS', label: 'Commercial goods' },
  { value: 'DOCUMENTS', label: 'Documents' },
  { value: 'ELECTRONICS', label: 'Electronics' },
];

const insuranceOptions = [
  { value: 'INSURED', label: 'Insured' },
  { value: 'NOT_INSURED', label: 'Not insured' },
];

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

  const formTitle = useMemo(() => (i18n.language === 'vi' ? 'Tạo đơn hàng demo' : 'Create demo shipment'), [i18n.language]);

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
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{t('nav.create', { defaultValue: 'Create Demo' })}</p>
        <h1 className="text-3xl font-bold text-foreground">{formTitle}</h1>
        <p className="mt-3 text-muted-foreground">Simulate a parcel flow and trigger the adaptive recovery experience.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box size={18} className="text-primary" />
              Shipment details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  <span className="flex items-center gap-2"><UserRound size={14} /> Sender name</span>
                  <input className="w-full rounded-md border border-input bg-background px-3 py-2" value={form.senderName} onChange={(e) => setForm({ ...form, senderName: e.target.value })} />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span className="flex items-center gap-2"><UserRound size={14} /> Sender phone</span>
                  <input className="w-full rounded-md border border-input bg-background px-3 py-2" value={form.senderPhone} onChange={(e) => setForm({ ...form, senderPhone: e.target.value })} />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  <span>Receiver name</span>
                  <input className="w-full rounded-md border border-input bg-background px-3 py-2" value={form.receiverName} onChange={(e) => setForm({ ...form, receiverName: e.target.value })} />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>Receiver phone</span>
                  <input className="w-full rounded-md border border-input bg-background px-3 py-2" value={form.receiverPhone} onChange={(e) => setForm({ ...form, receiverPhone: e.target.value })} />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  <span>Customer type</span>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2" value={form.customerType} onChange={(e) => setForm({ ...form, customerType: e.target.value })}>
                    {customerTypes.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>Parcel category</span>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2" value={form.parcelCategory} onChange={(e) => setForm({ ...form, parcelCategory: e.target.value })}>
                    {parcelCategories.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  <span>Insurance</span>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2" value={form.insuranceStatus} onChange={(e) => setForm({ ...form, insuranceStatus: e.target.value })}>
                    {insuranceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium">
                  <span>Declared value</span>
                  <input type="number" className="w-full rounded-md border border-input bg-background px-3 py-2" value={form.declaredValue} onChange={(e) => setForm({ ...form, declaredValue: e.target.value })} />
                </label>
              </div>

              <label className="space-y-2 text-sm font-medium">
                <span>Shipping fee</span>
                <input type="number" className="w-full rounded-md border border-input bg-background px-3 py-2" value={form.shippingFee} onChange={(e) => setForm({ ...form, shippingFee: e.target.value })} />
              </label>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating…' : 'Create shipment'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-muted/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-secondary" />
              What happens next
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-lg border border-border bg-background/80 p-4">
              <p className="font-semibold text-foreground">Instant tracking ID</p>
              <p className="mt-2">A demo shipment is generated with a tracking ID that can be followed in the tracking experience.</p>
            </div>
            <div className="rounded-lg border border-border bg-background/80 p-4">
              <p className="font-semibold text-foreground">Automatic recovery trigger</p>
              <p className="mt-2">If the parcel stalls long enough, the system creates a recovery case and opens the recovery center.</p>
            </div>
            <div className="rounded-lg border border-border bg-background/80 p-4">
              <p className="font-semibold text-foreground">Customer recovery options</p>
              <p className="mt-2">Customers can continue investigation, request refund, or choose replacement based on their profile.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
