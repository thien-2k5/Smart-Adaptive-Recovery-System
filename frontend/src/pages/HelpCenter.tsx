import { useState } from 'react';
import { BookOpen, CircleHelp, LifeBuoy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { buildDemoHelpArticles } from '../services/demoData';

export default function HelpCenter() {
  const [articles] = useState(() => buildDemoHelpArticles());

  return (
    <div className="container mx-auto px-4 py-10 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Help center</p>
        <h1 className="text-3xl font-bold text-foreground">Support and recovery guidance</h1>
        <p className="mt-2 text-muted-foreground">Customers can review policy, recovery instructions, and FAQ content in Vietnamese or English.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LifeBuoy size={18} className="text-primary" />
              Contact & support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="font-semibold text-foreground">Hotline</p>
              <p className="mt-1">1900 1515</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="font-semibold text-foreground">Email</p>
              <p className="mt-1">support@viettelpost.vn</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="font-semibold text-foreground">Office hours</p>
              <p className="mt-1">24/7 for urgent recovery cases</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={18} className="text-secondary" />
              Articles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  <CircleHelp size={14} />
                  {article.category}
                </div>
                <h3 className="mt-2 font-semibold text-foreground">{article.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{article.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
