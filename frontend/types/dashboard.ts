export interface DashboardStats {
  activeCandidates: number;
  openVacancies: number;
  weeklyInterviews: number;
  monthlyHires: number;
  averageTimeToHire: number; // в днях
  topSkillsInDemand: Array<{
    skill: string;
    count: number;
  }>;
}

export interface Activity {
  id: string;
  type: 'new_candidate' | 'status_update' | 'interview_added' | 'candidate_added' | 'interview_scheduled' | 'status_changed' | 'vacancy_created';
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
  entityId: string;
  entityType: string;
}

export interface Event {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  type: 'interview' | 'meeting';
  candidateId?: string;
  location?: string;
}

export interface DashboardData {
  stats: {
    activeCandidatesCount: number;
    openVacanciesCount: number;
    weeklyInterviewsCount: number;
  };
  recentActivities: Activity[];
  upcomingEvents: Event[];
}
