'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyDateTimeProps {
  date: string | Date;
  format?: 'short' | 'long' | 'time' | 'datetime';
}

function ClientOnlyDateTime({ date, format = 'datetime' }: ClientOnlyDateTimeProps) {
  const [formattedDate, setFormattedDate] = useState<string>('');
  
  useEffect(() => {
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
  
  return <span suppressHydrationWarning>{formattedDate}</span>;
}

export default ClientOnlyDateTime; 