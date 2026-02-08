'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TimezoneCard } from '@/components/timezone-card';
import { TimestampConverter } from '@/components/timestamp-converter';
import { popularTimezones, detectUserTimezone, type TimezoneInfo } from '@/lib/timezones';
import { translations } from '@/lib/translations';
import { Globe2, Plus, Clock } from 'lucide-react';

type Locale = 'en' | 'zh';

interface ClientPageProps {
  locale: Locale;
}

export function ClientPage({ locale }: ClientPageProps) {
  const router = useRouter();
  const [userTimezone, setUserTimezone] = useState<string | null>(null);
  const [selectedTimezones, setSelectedTimezones] = useState<TimezoneInfo[] | null>(null);
  const [language, setLanguage] = useState<Locale>(locale);
  const [mounted, setMounted] = useState(false);

  const t = translations[language];

  useEffect(() => {
    setMounted(true);
    const detected = detectUserTimezone();
    setUserTimezone(detected);

    setSelectedTimezones([
      popularTimezones.find(tz => tz.value === 'America/New_York')!,
      popularTimezones.find(tz => tz.value === 'Europe/London')!,
      popularTimezones.find(tz => tz.value === 'Asia/Tokyo')!,
    ].filter(Boolean));
  }, []);

  if (!mounted || !userTimezone || !selectedTimezones) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const handleLanguageChange = (newLocale: string) => {
    router.push(`/${newLocale}`);
  };

  const addTimezone = (timezoneValue: string) => {
    const timezone = popularTimezones.find(tz => tz.value === timezoneValue);
    if (timezone && !selectedTimezones.find(tz => tz.value === timezoneValue)) {
      setSelectedTimezones([...selectedTimezones, timezone]);
    }
  };

  const removeTimezone = (timezoneValue: string) => {
    setSelectedTimezones(selectedTimezones.filter(tz => tz.value !== timezoneValue));
  };

  if (!mounted || !userTimezone || !selectedTimezones) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const getUserTimezoneInfo = (): TimezoneInfo => {
    const existing = popularTimezones.find(tz => tz.value === userTimezone!);
    if (existing) return existing;
    
    return {
      value: userTimezone!,
      label: userTimezone!.split('/').pop()?.replace(/_/g, ' ') || userTimezone!,
      offset: 'UTC+0',
      region: 'Auto',
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Globe2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{t.title}</h1>
                <p className="text-sm text-muted-foreground">{t.subtitle}</p>
              </div>
            </div>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-2xl font-bold">{t.yourTimezone}</h2>
              <span className="text-sm text-muted-foreground">({t.autoDetected})</span>
            </div>
            <TimezoneCard
              timezone={userTimezone}
              label={getUserTimezoneInfo().label}
              isUserTimezone
              dateLabel={t.date}
              timeLabel={t.time}
            />
          </section>

          <section>
            <TimestampConverter language={language} defaultTimezone={userTimezone} />
          </section>

          <section>
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Select onValueChange={addTimezone}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder={t.selectTimezone} />
                    </SelectTrigger>
                    <SelectContent>
                      {popularTimezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label} ({tz.offset})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="secondary">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {selectedTimezones.length > 0 && (
            <section>
              <h2 className="mb-4 text-2xl font-bold">{t.compareTimezones}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {selectedTimezones.map((tz) => (
                  <TimezoneCard
                    key={tz.value}
                    timezone={tz.value}
                    label={tz.label}
                    onRemove={() => removeTimezone(tz.value)}
                    dateLabel={t.date}
                    timeLabel={t.time}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="pt-8">
            <h2 className="mb-6 text-center text-2xl font-bold">{t.features.title}</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Globe2 className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold">{t.features.autoDetect}</h3>
                   <p className="text-sm text-muted-foreground">
                     {t.features.autoDetectDesc}
                   </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Plus className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold">{t.features.multiConvert}</h3>
                   <p className="text-sm text-muted-foreground">
                     {t.features.multiConvertDesc}
                   </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold">{t.features.realTime}</h3>
                   <p className="text-sm text-muted-foreground">
                     {t.features.realTimeDesc}
                   </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-16 border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>{t.footer}</p>
        </div>
      </footer>
    </div>
  );
}
