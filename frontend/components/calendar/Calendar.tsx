'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import axiosInstance from '@/services/axios';
import { Event } from '@/types/event';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
}

const locales = {
  'ru': ru,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axiosInstance.get<Event[]>('/api/events');

      const formattedEvents: CalendarEvent[] = data.map((event: Event) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.startDate),
        end: new Date(event.endDate || event.startDate),
        allDay: event.allDay,
        resource: event.resource
      }));

      setEvents(formattedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Не удалось загрузить события');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Загрузка событий...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px]">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        messages={{
          next: 'Следующий',
          previous: 'Предыдущий',
          today: 'Сегодня',
          month: 'Месяц',
          week: 'Неделя',
          day: 'День',
          agenda: 'Повестка дня',
          date: 'Дата',
          time: 'Время',
          event: 'Событие',
          noEventsInRange: 'Нет событий в этом диапазоне',
          showMore: (total: number) => `+ Ещё ${total}`
        }}
      />
    </div>
  );
}
