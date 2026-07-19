import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle, CheckCircle2, Clock3, MessageSquareText,
  Package2, RefreshCcw, ArrowLeft, Timer, ShieldCheck,
  CircleDot
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { buildDemoRecoveryCase } from '../services/demoData';
import api from '../services/api';

const optionIcons: Record<string, typeof RefreshCcw> = {
  CONTINUE_INVESTIGATION: ShieldCheck,
  REFUND: Timer,
  REPLACEMENT: Package2,
};

const optionLabels: Record<string, { en: string; vi: string }> = {
  CONTINUE_INVESTIGATION: { en: 'Continue Investigation', vi: 'Tiếp tục điều tra' },
  REFUND: { en: 'Request Refund', vi: 'Yêu cầu hoàn tiền' },
  REPLACEMENT: { en: 'Request Replacement', vi: 'Yêu cầu thay thế' },
};

export default function RecoveryCenter() {
  const { caseId } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(() => buildDemoRecoveryCase(caseId));
  const [selectedOption, setSelectedOption] = useState<string | null>(caseData.availableOptions[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSelectOption = async (option: string) => {
    setSelectedOption(option);
    setSubmitting(true);
    try {
      await api.post(`/recoverys/${caseData.caseId}/select-option`, { option });
    } catch {
      // Demo fallback — just update local state
    }
    setCaseData(prev => ({ ...prev, selectedOption: option }));
    setSubmitting(false);
  };

  const lang = i18n.language as 'en' | 'vi';

  return (
    <div className="container mx-auto px-4 py-10 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
            <ArrowLeft size={14} />
            {t('common.back')}
          </button>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{t('recovery.title')}</p>
          <h1 className="text-3xl font-bold text-foreground">{t('recovery.caseId')}: {caseData.caseId}</h1>
          <p className="mt-2 text-muted-foreground">{t('recovery.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <Badge variant={caseData.investigationStatus === 'RESOLVED' ? 'success' : 'warning'} className="py-1.5 px-4">
            {caseData.investigationStatus}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Recovery Overview */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package2 size={18} className="text-primary" />
              {t('recovery.overview')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">{t('recovery.trackingId')}</p>
                <p className="mt-1 font-semibold text-foreground font-mono">{caseData.trackingId}</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">{t('recovery.recoveryMode')}</p>
                <p className="mt-1 font-semibold text-foreground">{caseData.recoveryMode.replace(/_/g, ' ')}</p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                <CircleDot size={14} className="text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="text-sm font-medium">{caseData.customerType.replace(/_/g, ' ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                <Package2 size={14} className="text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Parcel</p>
                  <p className="text-sm font-medium">{caseData.parcelCategory.replace(/_/g, ' ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                <ShieldCheck size={14} className="text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Insurance</p>
                  <p className="text-sm font-medium">{caseData.insuranceStatus}</p>
                </div>
              </div>
            </div>

            {/* Estimated Resolution */}
            <div className="rounded-xl border border-border bg-secondary/5 p-4">
              <div className="flex items-center gap-2 text-secondary">
                <Clock3 size={16} />
                <span className="font-semibold">{t('recovery.estimatedResolution')}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t('recovery.estimatedResolutionDesc', { hours: caseData.estimatedResolutionHours })}</p>
            </div>

            {/* Recommended Action */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-primary">
                <AlertTriangle size={16} />
                <span className="font-semibold">{t('recovery.recommendedAction')}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t('recovery.recommendedActionDesc')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Available Options */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCcw size={18} className="text-secondary" />
              {t('recovery.availableOptions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {caseData.availableOptions.map((option, index) => {
              const Icon = optionIcons[option] ?? RefreshCcw;
              const label = optionLabels[option]?.[lang] ?? option.replace(/_/g, ' ');
              const isSelected = option === selectedOption;
              const isRecommended = index === 0;

              return (
                <div
                  key={option}
                  className={`rounded-xl border p-4 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-muted/30 hover:border-primary/30 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{label}</p>
                          {isRecommended && (
                            <Badge variant="secondary" className="text-[10px]">★</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {isRecommended ? t('recovery.bestFit') : t('recovery.canSelect')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSelectOption(option)}
                      disabled={submitting}
                    >
                      {isSelected ? t('recovery.selected') : t('recovery.choose')}
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        {/* Investigation Timeline */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-secondary" />
              {t('recovery.investigationTimeline')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {caseData.investigationTimeline.map((item, index) => (
              <div key={`${item.step}-${index}`} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    item.isCompleted
                      ? 'border-secondary bg-secondary/10'
                      : 'border-muted-foreground/30 bg-muted/50'
                  }`}>
                    {item.isCompleted
                      ? <CheckCircle2 size={14} className="text-secondary" />
                      : <Clock3 size={14} className="text-muted-foreground" />
                    }
                  </div>
                  {index < caseData.investigationTimeline.length - 1 && (
                    <div className={`my-1 h-full w-0.5 ${item.isCompleted ? 'bg-secondary/30' : 'bg-border'}`} />
                  )}
                </div>
                <div className={`flex-1 rounded-xl border p-4 mb-3 ${
                  item.isCompleted ? 'border-secondary/20 bg-secondary/5' : 'border-border bg-muted/20'
                }`}>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{item.title}</p>
                    {item.isCompleted && <Badge variant="success" className="text-[10px]">Done</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText size={18} className="text-primary" />
              {t('recovery.updatesNotifications')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {caseData.notifications.map((item, index) => (
              <div key={`${item.title}-${index}`} className="flex gap-3 rounded-xl border border-border bg-muted/20 p-4">
                <div className="mt-0.5 rounded-full bg-primary/10 p-2 shrink-0">
                  <MessageSquareText size={14} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US')}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
