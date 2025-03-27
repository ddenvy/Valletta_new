import { NextResponse } from 'next/server';
import { DashboardData } from '@/types/dashboard';

export async function GET() {
  try {
    // В реальном приложении здесь будет запрос к базе данных
    const mockData: DashboardData = {
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
          timestamp: new Date().toISOString(),
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
          timestamp: new Date(Date.now() - 3600000).toISOString(),
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
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          userId: 'user1',
          userName: 'Анна Смирнова',
          entityId: 'cand3',
          entityType: 'interview',
        },
      ],
      upcomingEvents: [
        {
          id: 'event1',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          endTime: new Date(Date.now() + 90000000).toISOString(),
          title: 'Интервью с Алексеем Ивановым',
          description: 'Техническое интервью на позицию Senior React Developer',
          type: 'interview',
          candidateId: 'cand4',
        },
        {
          id: 'event2',
          startTime: new Date(Date.now() + 172800000).toISOString(),
          endTime: new Date(Date.now() + 180000000).toISOString(),
          title: 'Встреча команды',
          description: 'Еженедельная встреча команды рекрутинга',
          type: 'meeting',
        },
      ],
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 