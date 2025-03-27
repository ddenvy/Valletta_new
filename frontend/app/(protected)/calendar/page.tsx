'use client';

import Calendar from '@/components/calendar/Calendar';
import CalendarPage from '@/features/Calendar/CalendarPage';

export default function CalendarRoute() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Календарь</h1>
      <Calendar />
    </div>
  );
}
