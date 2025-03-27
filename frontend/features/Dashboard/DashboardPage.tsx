// DashboardPage.tsx
import React from 'react';
import { DashboardData } from '@/types/dashboard';
import { CalendarIcon, UserIcon, BriefcaseIcon, ClockIcon } from '@heroicons/react/24/outline';
import DynamicClientOnlyDateTime from '@/components/shared/DynamicClientOnlyDateTime';

// Mock data for demonstration
const dashboardData: DashboardData = {
  stats: {
    activeCandidatesCount: 24,
    openVacanciesCount: 8,
    weeklyInterviewsCount: 12,
  },
  recentActivities: [
    {
      id: '1',
      type: 'new_candidate',
      title: 'Новый кандидат',
      description: 'Добавлен новый кандидат на позицию Frontend Developer',
      timestamp: '2023-06-15T10:30:00Z',
      userId: 'user1',
      userName: 'Анна Смирнова',
      entityId: 'cand1',
      entityType: 'candidate',
    },
    {
      id: '2',
      type: 'status_update',
      title: 'Обновление статуса',
      description: 'Кандидат перешел на этап технического интервью',
      timestamp: '2023-06-14T14:45:00Z',
      userId: 'user2',
      userName: 'Иван Петров',
      entityId: 'cand2',
      entityType: 'candidate',
    },
    {
      id: '3',
      type: 'interview_added',
      title: 'Назначено интервью',
      description: 'Техническое интервью назначено на 20 июня',
      timestamp: '2023-06-13T09:15:00Z',
      userId: 'user1',
      userName: 'Анна Смирнова',
      entityId: 'cand3',
      entityType: 'interview',
    },
  ],
  upcomingEvents: [
    {
      id: 'event1',
      startTime: '2023-06-16T11:00:00Z',
      endTime: '2023-06-16T12:00:00Z',
      title: 'Интервью с Алексеем Ивановым',
      description: 'Техническое интервью на позицию Senior React Developer',
      type: 'interview',
      candidateId: 'cand4',
    },
    {
      id: 'event2',
      startTime: '2023-06-17T14:30:00Z',
      endTime: '2023-06-17T15:30:00Z',
      title: 'Встреча команды',
      description: 'Еженедельная встреча команды рекрутинга',
      type: 'meeting',
    },
  ],
};

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'new_candidate':
      return <UserIcon className="h-5 w-5 text-blue-500" />;
    case 'status_update':
      return <ClockIcon className="h-5 w-5 text-green-500" />;
    case 'new_vacancy':
      return <BriefcaseIcon className="h-5 w-5 text-purple-500" />;
    case 'interview_added':
      return <CalendarIcon className="h-5 w-5 text-orange-500" />;
    case 'comment_added':
      return <UserIcon className="h-5 w-5 text-gray-500" />;
    default:
      return <UserIcon className="h-5 w-5 text-gray-500" />;
  }
};

export default function DashboardPage() {
  const { stats, recentActivities, upcomingEvents } = dashboardData;

  return (
    <div className="notion-page">
      <h1 className="mb-8">Панель управления</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <h3>Активные кандидаты</h3>
            <UserIcon className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-3xl font-bold mt-2">{stats.activeCandidatesCount}</p>
        </div>
        
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <h3>Открытые вакансии</h3>
            <BriefcaseIcon className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-3xl font-bold mt-2">{stats.openVacanciesCount}</p>
        </div>
        
        <div className="stats-card">
          <div className="flex items-center justify-between">
            <h3>Интервью на этой неделе</h3>
            <CalendarIcon className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-3xl font-bold mt-2">{stats.weeklyInterviewsCount}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="notion-card">
          <h2 className="mb-4">Недавние активности</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <ActivityIcon type={activity.type} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-base font-medium">{activity.title}</h3>
                    <span className="text-sm text-gray-500">
                      <DynamicClientOnlyDateTime date={activity.timestamp} format="datetime" />
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">от {activity.userName}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="notion-button w-full mt-4">Показать все активности</button>
        </div>
        
        {/* Upcoming Events */}
        <div className="notion-card">
          <h2 className="mb-4">Предстоящие события</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-base font-medium">{event.title}</h3>
                    <span className="text-sm text-gray-500">
                      {event.startTime ? (
                        <DynamicClientOnlyDateTime date={event.startTime} format="datetime" />
                      ) : 'Не указано'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {event.type === 'interview' ? 'Интервью' : 'Встреча'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="notion-button w-full mt-4">Показать все события</button>
        </div>
      </div>
    </div>
  );
}
