// CalendarPage.tsx
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ru';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Event } from '@/types/dashboard';
import PageLayout from '@/components/shared/PageLayout';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Set up the localizer
moment.locale('ru');
const localizer = momentLocalizer(moment);

// Mock events data
const events: Event[] = [
  {
    id: '1',
    title: 'Техническое интервью с Алексеем Ивановым',
    startTime: '2023-06-20T10:00:00Z',
    endTime: '2023-06-20T11:00:00Z',
    description: 'Техническое интервью на позицию Senior React Developer',
    type: 'interview',
    candidateId: 'cand1',
    userId: 'user1'
  },
  {
    id: '2',
    title: 'HR интервью с Марией Петровой',
    startTime: '2023-06-21T14:00:00Z',
    endTime: '2023-06-21T15:00:00Z',
    description: 'HR интервью на позицию UX/UI Designer',
    type: 'interview',
    candidateId: 'cand2',
    userId: 'user2'
  },
  {
    id: '3',
    title: 'Встреча команды рекрутинга',
    startTime: '2023-06-22T11:00:00Z',
    endTime: '2023-06-22T12:00:00Z',
    description: 'Еженедельная встреча команды рекрутинга',
    type: 'meeting',
    userId: 'user1'
  }
];

// Convert events to the format expected by react-big-calendar
const calendarEvents = events.map(event => ({
  id: event.id,
  title: event.title,
  start: event.startTime ? new Date(event.startTime) : new Date(),
  end: event.endTime ? new Date(event.endTime) : new Date(),
  description: event.description,
  type: event.type
}));

// Custom event component for the calendar
const EventComponent = ({ event }: any) => (
  <div className={`p-1 small ${event.type === 'interview' ? 'bg-primary text-white' : 'bg-success text-white'}`}>
    {event.title}
  </div>
);

export default function CalendarPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setShowModal(true);
  };

  const addButton = (
    <button 
      className="btn btn-primary btn-sm d-flex align-items-center gap-2"
      onClick={() => {
        setSelectedDate(new Date());
        setShowModal(true);
      }}
    >
      <PlusIcon className="icon-sm" />
      <span>Добавить событие</span>
    </button>
  );

  return (
    <PageLayout 
      title="Календарь" 
      actions={addButton}
      contentPadding="p-4"
    >
      <div className="card h-100">
        <div className="card-body">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 'calc(100vh - 240px)' }}
            components={{
              event: EventComponent
            }}
            onSelectSlot={handleSelectSlot}
            selectable
            messages={{
              next: "Следующий",
              previous: "Предыдущий",
              today: "Сегодня",
              month: "Месяц",
              week: "Неделя",
              day: "День",
              agenda: "Повестка",
              date: "Дата",
              time: "Время",
              event: "Событие",
              noEventsInRange: "Нет событий в этом диапазоне"
            }}
          />
        </div>
      </div>

      {/* Модальное окно добавления события */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Добавить событие</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                />
              </div>
              
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="eventTitle" className="form-label">Название</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="eventTitle"
                      placeholder="Название события" 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="eventType" className="form-label">Тип</label>
                    <select className="form-select" id="eventType">
                      <option value="interview">Интервью</option>
                      <option value="meeting">Встреча</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="startDate" className="form-label">Дата начала</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        id="startDate"
                        defaultValue={selectedDate ? selectedDate.toISOString().split('T')[0] : undefined}
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="startTime" className="form-label">Время начала</label>
                      <input 
                        type="time" 
                        className="form-control" 
                        id="startTime"
                        defaultValue={selectedDate ? selectedDate.toTimeString().slice(0, 5) : undefined}
                      />
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Отмена
                </button>
                <button type="button" className="btn btn-primary">
                  Сохранить
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </PageLayout>
  );
}
