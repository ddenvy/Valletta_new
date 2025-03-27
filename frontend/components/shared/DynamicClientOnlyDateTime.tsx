import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DynamicClientOnlyDateTimeProps {
  date: string;
  format?: string;
  showTime?: boolean;
}

export default function DynamicClientOnlyDateTime({
  date,
  format: formatString = 'dd MMM yyyy',
  showTime = false
}: DynamicClientOnlyDateTimeProps) {
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    try {
      // Обработка предопределенных форматов
      let dateFormat = formatString;
      
      // Преобразуем предопределенные строковые форматы в правильный формат date-fns
      switch (formatString) {
        case 'datetime':
          dateFormat = 'dd MMM yyyy HH:mm';
          break;
        case 'short':
          dateFormat = 'dd.MM.yyyy';
          break;
        case 'DD.MM.YYYY': // Для обратной совместимости
          dateFormat = 'dd.MM.yyyy';
          break;
      }
      
      const parsedDate = parseISO(date);
      const finalFormat = showTime && formatString !== 'datetime' ? `${dateFormat} HH:mm` : dateFormat;
      setFormattedDate(format(parsedDate, finalFormat, { locale: ru }));
    } catch (error) {
      console.error('Error formatting date:', error);
      setFormattedDate('Некорректная дата');
    }
  }, [date, formatString, showTime]);

  return <span>{formattedDate}</span>;
} 