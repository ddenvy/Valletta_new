'use client';

import { useEffect, useState } from 'react';

interface ClientDateTimeProps {
  date: string | Date;
  format?: 'short' | 'long' | 'time' | 'datetime';
}

export default function ClientDateTime({ date, format = 'datetime' }: ClientDateTimeProps) {
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Устанавливаем флаг, что мы на клиенте
    setIsClient(true);
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    };
    
    if (format === 'long') {
      options.year = 'numeric';
      options.month = 'long';
    } else if (format === 'short') {
      options.year = undefined;
    } else if (format === 'time') {
      options.day = undefined;
      options.month = undefined;
    }
    
    const formatted = new Intl.DateTimeFormat('ru-RU', options).format(dateObj);
    setFormattedDate(formatted);
  }, [date, format]);
  
  // Возвращаем пустой плейсхолдер на сервере
  if (!isClient) {
    return <span suppressHydrationWarning>-</span>;
  }
  
  return <span suppressHydrationWarning>{formattedDate}</span>;
}