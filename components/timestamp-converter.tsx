'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRightLeft, Copy, Check } from 'lucide-react';
import { popularTimezones } from '@/lib/timezones';
import type { Language } from '@/lib/translations';

interface TimestampConverterProps {
  language: Language;
  defaultTimezone: string;
}

export function TimestampConverter({ language, defaultTimezone }: TimestampConverterProps) {
  const [timestamp, setTimestamp] = useState<string>('');
  const [datetime, setDatetime] = useState<string>('');
  const [selectedTimezone, setSelectedTimezone] = useState<string>(defaultTimezone);
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const t = {
    en: {
      title: 'Timestamp Converter',
      timestamp: 'Timestamp',
      timestampPlaceholder: 'Enter timestamp (e.g., 1704067200)',
      datetime: 'Date & Time',
      datetimePlaceholder: 'Select date and time',
      timezone: 'Timezone',
      convertToTime: 'Convert to Time',
      convertToTimestamp: 'Convert to Timestamp',
      result: 'Result',
      copy: 'Copy',
      copied: 'Copied!',
      useNow: 'Use Now',
      milliseconds: 'Milliseconds',
      seconds: 'Seconds',
    },
    zh: {
      title: '时间戳转换器',
      timestamp: '时间戳',
      timestampPlaceholder: '输入时间戳（例如：1704067200）',
      datetime: '日期时间',
      datetimePlaceholder: '选择日期和时间',
      timezone: '时区',
      convertToTime: '转换为时间',
      convertToTimestamp: '转换为时间戳',
      result: '结果',
      copy: '复制',
      copied: '已复制！',
      useNow: '使用当前时间',
      milliseconds: '毫秒',
      seconds: '秒',
    },
  }[language];

  const convertTimestampToTime = () => {
    if (!timestamp) return;
    
    const ts = parseInt(timestamp);
    if (isNaN(ts)) return;

    // Auto-detect if milliseconds or seconds
    const date = ts > 10000000000 ? new Date(ts) : new Date(ts * 1000);
    
    const formatted = new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
      timeZone: selectedTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);

    setResult(formatted);
  };

  const convertTimeToTimestamp = () => {
    if (!datetime) return;

    const date = new Date(datetime);
    const ts = Math.floor(date.getTime() / 1000);
    setResult(ts.toString());
  };

  const useCurrentTime = () => {
    const now = new Date();
    // Format for datetime-local input in user's local timezone
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
    setDatetime(formatted);
  };

  const copyResult = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Timestamp to Time */}
          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
              <Label htmlFor="timestamp">{t.timestamp}</Label>
              <Input
                id="timestamp"
                placeholder={t.timestampPlaceholder}
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                type="text"
              />
              <p className="text-xs text-muted-foreground">
                {t.seconds} / {t.milliseconds}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone-ts">{t.timezone}</Label>
              <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                <SelectTrigger id="timezone-ts">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {popularTimezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label} ({tz.offset})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={convertTimestampToTime} className="w-full">
              {t.convertToTime}
            </Button>
          </div>

          {/* Time to Timestamp */}
          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
              <Label htmlFor="datetime">{t.datetime}</Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                lang={language === 'zh' ? 'zh-CN' : 'en-US'}
              />
            </div>
            <Button onClick={useCurrentTime} variant="outline" className="w-full bg-transparent">
              {t.useNow}
            </Button>
            <Button onClick={convertTimeToTimestamp} className="w-full">
              {t.convertToTimestamp}
            </Button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-2">
            <Label htmlFor="result">{t.result}</Label>
            <div className="flex gap-2">
              <Input id="result" value={result} readOnly className="font-mono" />
              <Button onClick={copyResult} variant="outline" size="icon">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
