import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Clock3, MessageSquareText, Package2, RefreshCcw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { buildDemoRecoveryCase } from '../services/demoData';

export default function RecoveryCenter() {
  const { caseId } = useParams();
  const [caseData] = useState(() => buildDemoRecoveryCase(caseId));
  const selectedOption = useMemo(() => caseData.availableOptions[0], [caseData.availableOptions]);

  return (
    <div className="container mx-auto px-4 py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Recovery center</p>
          <h1 className="text-3xl font-bold text-foreground">Case {caseData.caseId}</h1>
          <p className="mt-2 text-muted-foreground">The system is coordinating the recovery workflow for the affected shipment.</p>
        </div>
        <div className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-muted-foreground">
          Status: {caseData.investigationStatus}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package2 size={18} className="text-primary" />
              Recovery overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Tracking ID</p>
                <p className="mt-1 font-semibold text-foreground">{caseData.trackingId}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Recovery mode</p>
                <p className="mt-1 font-semibold text-foreground">{caseData.recoveryMode}</p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-background/70 p-4">
              <div className="flex items-center gap-2 text-secondary">
                <Clock3 size={16} />
                <span className="font-semibold">Estimated resolution</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">The investigation is expected to conclude within {caseData.estimatedResolutionHours} hours.</p>
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-primary">
                <AlertTriangle size={16} />
                <span className="font-semibold">Recommended action</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Continue investigation to preserve the shipment while the warehouse checks the latest scan logs.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCcw size={18} className="text-secondary" />
              Available options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {caseData.availableOptions.map((option) => (
              <div key={option} className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{option}</p>
                    <p className="text-sm text-muted-foreground">{option === selectedOption ? 'Best fit based on the current profile' : 'Customer can select this option if preferred'}</p>
                  </div>
                  <Button variant={option === selectedOption ? 'default' : 'outline'} size="sm">
                    {option === selectedOption ? 'Selected' : 'Choose'}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-secondary" />
              Investigation timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {caseData.investigationTimeline.map((item, index) => (
              <div key={`${item.step}-${index}`} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`mt-1 h-3 w-3 rounded-full ${item.isCompleted ? 'bg-secondary' : 'bg-muted-foreground/40'}`} />
                  {index < caseData.investigationTimeline.length - 1 && <div className="mt-1 h-full w-px bg-border" />}
                </div>
                <div className="flex-1 rounded-lg border border-border bg-muted/30 p-4">
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText size={18} className="text-primary" />
              Updates & notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {caseData.notifications.map((item, index) => (
              <div key={`${item.title}-${index}`} className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
