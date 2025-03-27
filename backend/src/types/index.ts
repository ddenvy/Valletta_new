export interface Candidate {
    id: string;
    nameRu: string;
    nameEn: string;
    resumeFileName?: string;
    resumeFileUrl?: string;
    interviewFile?: string;
    vacancy: string;
    techStack?: string;
    status: 'new' | 'screening' | 'interviewing' | 'test_task' | 'offered' | 'rejected' | 'hired' | 'archived';
    statusComment?: string;
    screeningDate?: Date;
    recruiter?: string;
    telegram?: string;
    statusUpdatedAt: Date;
    locationCityCountry?: string;
    englishLevel?: string;
    minSalary?: number;
    maxSalary?: number;
    salaryCurrency?: string;
    skype?: string;
    email: string;
    phone?: string;
    comments?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
} 