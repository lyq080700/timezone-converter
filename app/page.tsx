'use client';

import { useState, useEffect } from 'react';
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
import { translations, type Language } from '@/lib/translations';
import { Globe2, Plus, Clock } from 'lucide-react';

export default function Home() {
  const [userTimezone, setUserTimezone] = useState<string>('');
  const [selectedTimezones, setSelectedTimezones] = useState<TimezoneInfo[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  const t = translations[language];

  useEffect(() => {
    setMounted(true);
    const detected = detectUserTimezone();
    setUserTimezone(detected);
    
    // Add some default timezones for comparison
    setSelectedTimezones([
      popularTimezones.find(tz => tz.value === 'America/New_York')!,
      popularTimezones.find(tz => tz.value === 'Europe/London')!,
      popularTimezones.find(tz => tz.value === 'Asia/Tokyo')!,
    ].filter(Boolean));
  }, []);

  const addTimezone = (timezoneValue: string) => {
    const timezone = popularTimezones.find(tz => tz.value === timezoneValue);
    if (timezone && !selectedTimezones.find(tz => tz.value === timezoneValue)) {
      setSelectedTimezones([...selectedTimezones, timezone]);
    }
  };

  const removeTimezone = (timezoneValue: string) => {
    setSelectedTimezones(selectedTimezones.filter(tz => tz.value !== timezoneValue));
  };

  const getUserTimezoneInfo = (): TimezoneInfo => {
    const existing = popularTimezones.find(tz => tz.value === userTimezone);
    if (existing) return existing;
    
    return {
      value: userTimezone,
      label: userTimezone.split('/').pop()?.replace(/_/g, ' ') || userTimezone,
      offset: 'UTC+0',
      region: 'Auto',
    };
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <Select value={language} onValueChange={(val) => setLanguage(val as Language)}>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Your Timezone Section */}
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

          {/* Timestamp Converter */}
          <section>
            <TimestampConverter language={language} defaultTimezone={userTimezone} />
          </section>

          {/* Add Timezone */}
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

          {/* Compare Timezones */}
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

          {/* Features */}
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
                    {language === 'en' 
                      ? 'Automatically detects your current timezone'
                      : '自动检测您当前所在的时区'}
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
                    {language === 'en'
                      ? 'Compare multiple timezones simultaneously'
                      : '同时对比多个时区的时间'}
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
                    {language === 'en'
                      ? 'Live clock updates every second'
                      : '实时更新时钟，精确到秒'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            {language === 'en'
              ? 'Built for global professionals who need accurate timezone conversion'
              : '为需要准确时区转换的全球专业人士打造'}
          </p>
        </div>
      </footer>
    </div>
  );
}
