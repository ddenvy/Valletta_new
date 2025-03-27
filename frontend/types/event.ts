export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: 'interview' | 'meeting' | 'deadline';
  status: 'scheduled' | 'completed' | 'cancelled';
  allDay?: boolean;
  resource?: any;
  participants?: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
  location?: string;
  metadata?: {
    candidateId?: string;
    vacancyId?: string;
    zoomLink?: string;
    notes?: string;
  };
} 