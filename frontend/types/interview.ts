export type InterviewStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Postponed';
export type InterviewType = 'Technical' | 'HR' | 'Final';
export type RecommendationType = 'Hire' | 'Reject' | 'Consider' | 'Need Additional Interview';

export interface Interview {
    id: string;
    candidateId: string;
    type: InterviewType;
    status: InterviewStatus;
    date: string;
    duration: number; // в минутах
    interviewer: {
        id: string;
        name: string;
        position: string;
    };
    technicalSkills: {
        skill: string;
        rating: number; // 1-5
        comments: string;
    }[];
    englishAssessment: {
        speaking: number; // 1-5
        listening: number; // 1-5
        overall: number; // 1-5
        comments: string;
    };
    softSkills: {
        communication: number; // 1-5
        teamwork: number; // 1-5
        problemSolving: number; // 1-5
        comments: string;
    };
    projectExperience: string;
    generalComments: string;
    recommendation: RecommendationType;
    attachments: Array<{
        id: string;
        name: string;
        url: string;
        type: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

export interface InterviewFormData extends Omit<Interview, 'id' | 'candidateId' | 'createdAt' | 'updatedAt'> {}
