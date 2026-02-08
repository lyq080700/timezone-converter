'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, MapPin } from 'lucide-react';
import { formatTimeInTimezone, formatDateInTimezone } from '@/lib/timezones';

interface TimezoneCardProps {
  timezone: string;
  label: string;
  onRemove?: () => void;
  isUserTimezone?: boolean;
  dateLabel: string;
  timeLabel: string;
}

export function TimezoneCard({
  timezone,
  label,
  onRemove,
  isUserTimezone,
  dateLabel,
  timeLabel,
}: TimezoneCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const time = formatTimeInTimezone(currentTime, timezone);
  const date = formatDateInTimezone(currentTime, timezone);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-lg">{label}</CardTitle>
          </div>
          {!isUserTimezone && onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mr-2 -mt-1"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{timeLabel}</p>
          <p className="text-3xl font-bold tabular-nums">{time}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{dateLabel}</p>
          <p className="text-sm font-medium">{date}</p>
        </div>
      </CardContent>
    </Card>
  );
}
