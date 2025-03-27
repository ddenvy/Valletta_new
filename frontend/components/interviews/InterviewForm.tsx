'use client';

import React, { useState } from 'react';
import { Interview, InterviewFormData, InterviewType, InterviewStatus, RecommendationType } from '@/types/interview';

interface InterviewFormProps {
  initialData?: Interview;
  candidateId?: string;
  onSubmit: (data: InterviewFormData) => Promise<void>;
  onCancel: () => void;
}

interface FormSection {
  [key: string]: string | number | { skill: string; rating: number; comments: string; }[];
}

interface FormData {
  general: {
    type: InterviewType;
    status: InterviewStatus;
    date: string;
    duration: number;
    interviewer: {
      id: string;
      name: string;
      position: string;
    };
  };
  technical: {
    skills: {
      skill: string;
      rating: number;
      comments: string;
    }[];
    projectExperience: string;
  };
  english: {
    speaking: number;
    listening: number;
    overall: number;
    comments: string;
  };
  soft: {
    communication: number;
    teamwork: number;
    problemSolving: number;
    comments: string;
  };
  final: {
    generalComments: string;
    recommendation: RecommendationType;
  };
}

const defaultFormData: FormData = {
  general: {
    type: 'Technical',
    status: 'Scheduled',
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    interviewer: {
      id: '',
      name: '',
      position: ''
    }
  },
  technical: {
    skills: [],
    projectExperience: ''
  },
  english: {
    speaking: 1,
    listening: 1,
    overall: 1,
    comments: ''
  },
  soft: {
    communication: 1,
    teamwork: 1,
    problemSolving: 1,
    comments: ''
  },
  final: {
    generalComments: '',
    recommendation: 'Consider'
  }
};

export default function InterviewForm({ initialData, candidateId, onSubmit, onCancel }: InterviewFormProps) {
  const [formData, setFormData] = useState<FormData>(
    initialData
      ? {
          general: {
            type: initialData.type,
            status: initialData.status,
            date: initialData.date,
            duration: initialData.duration,
            interviewer: initialData.interviewer
          },
          technical: {
            skills: initialData.technicalSkills,
            projectExperience: initialData.projectExperience
          },
          english: initialData.englishAssessment,
          soft: initialData.softSkills,
          final: {
            generalComments: initialData.generalComments,
            recommendation: initialData.recommendation
          }
        }
      : defaultFormData
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (section: keyof FormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submissionData: InterviewFormData = {
        type: formData.general.type,
        status: formData.general.status,
        date: formData.general.date,
        duration: formData.general.duration,
        interviewer: formData.general.interviewer,
        technicalSkills: formData.technical.skills,
        projectExperience: formData.technical.projectExperience,
        englishAssessment: formData.english,
        softSkills: formData.soft,
        generalComments: formData.final.generalComments,
        recommendation: formData.final.recommendation,
        attachments: []
      };

      await onSubmit(submissionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при сохранении интервью');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Общая информация */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Общая информация</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Тип интервью
            </label>
            <select
              id="type"
              value={formData.general.type}
              onChange={(e) => handleChange('general', 'type', e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            >
              <option value="Technical">Техническое</option>
              <option value="HR">HR</option>
              <option value="Final">Финальное</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Статус
            </label>
            <select
              id="status"
              value={formData.general.status}
              onChange={(e) => handleChange('general', 'status', e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            >
              <option value="Scheduled">Запланировано</option>
              <option value="Completed">Завершено</option>
              <option value="Cancelled">Отменено</option>
              <option value="Postponed">Отложено</option>
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Дата интервью
            </label>
            <input
              type="date"
              id="date"
              value={formData.general.date}
              onChange={(e) => handleChange('general', 'date', e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Длительность (минуты)
            </label>
            <input
              type="number"
              id="duration"
              value={formData.general.duration}
              onChange={(e) => handleChange('general', 'duration', parseInt(e.target.value))}
              required
              min="15"
              step="15"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="interviewer" className="block text-sm font-medium text-gray-700">
              Интервьюер
            </label>
            <div className="mt-1 grid grid-cols-1 gap-3">
              <input
                type="text"
                id="interviewer-name"
                value={formData.general.interviewer.name}
                onChange={(e) => handleChange('general', 'interviewer', { ...formData.general.interviewer, name: e.target.value })}
                placeholder="Имя"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
              <input
                type="text"
                id="interviewer-position"
                value={formData.general.interviewer.position}
                onChange={(e) => handleChange('general', 'interviewer', { ...formData.general.interviewer, position: e.target.value })}
                placeholder="Должность"
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Технические навыки */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Технические навыки</h3>
        <div className="space-y-6">
          {formData.technical.skills.map((skill, index) => (
            <div key={index} className="grid grid-cols-1 gap-3">
              <input
                type="text"
                value={skill.skill}
                onChange={(e) => {
                  const newSkills = [...formData.technical.skills];
                  newSkills[index] = { ...skill, skill: e.target.value };
                  handleChange('technical', 'skills', newSkills);
                }}
                placeholder="Навык"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
              <input
                type="number"
                value={skill.rating}
                onChange={(e) => {
                  const newSkills = [...formData.technical.skills];
                  newSkills[index] = { ...skill, rating: parseInt(e.target.value) };
                  handleChange('technical', 'skills', newSkills);
                }}
                min="1"
                max="5"
                placeholder="Оценка (1-5)"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
              <textarea
                value={skill.comments}
                onChange={(e) => {
                  const newSkills = [...formData.technical.skills];
                  newSkills[index] = { ...skill, comments: e.target.value };
                  handleChange('technical', 'skills', newSkills);
                }}
                placeholder="Комментарии"
                rows={2}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  const newSkills = formData.technical.skills.filter((_, i) => i !== index);
                  handleChange('technical', 'skills', newSkills);
                }}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Удалить навык
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newSkills = [...formData.technical.skills, { skill: '', rating: 1, comments: '' }];
              handleChange('technical', 'skills', newSkills);
            }}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Добавить навык
          </button>

          <div>
            <label htmlFor="projectExperience" className="block text-sm font-medium text-gray-700">
              Опыт работы над проектами
            </label>
            <textarea
              id="projectExperience"
              value={formData.technical.projectExperience}
              onChange={(e) => handleChange('technical', 'projectExperience', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Оценка английского */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Оценка английского</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="speaking" className="block text-sm font-medium text-gray-700">
              Разговорный (1-5)
            </label>
            <input
              type="number"
              id="speaking"
              value={formData.english.speaking}
              onChange={(e) => handleChange('english', 'speaking', parseInt(e.target.value))}
              required
              min="1"
              max="5"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="listening" className="block text-sm font-medium text-gray-700">
              Восприятие на слух (1-5)
            </label>
            <input
              type="number"
              id="listening"
              value={formData.english.listening}
              onChange={(e) => handleChange('english', 'listening', parseInt(e.target.value))}
              required
              min="1"
              max="5"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="overall" className="block text-sm font-medium text-gray-700">
              Общая оценка (1-5)
            </label>
            <input
              type="number"
              id="overall"
              value={formData.english.overall}
              onChange={(e) => handleChange('english', 'overall', parseInt(e.target.value))}
              required
              min="1"
              max="5"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="englishComments" className="block text-sm font-medium text-gray-700">
              Комментарии по английскому
            </label>
            <textarea
              id="englishComments"
              value={formData.english.comments}
              onChange={(e) => handleChange('english', 'comments', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Софт скиллы */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Софт скиллы</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="communication" className="block text-sm font-medium text-gray-700">
              Коммуникация (1-5)
            </label>
            <input
              type="number"
              id="communication"
              value={formData.soft.communication}
              onChange={(e) => handleChange('soft', 'communication', parseInt(e.target.value))}
              required
              min="1"
              max="5"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="teamwork" className="block text-sm font-medium text-gray-700">
              Работа в команде (1-5)
            </label>
            <input
              type="number"
              id="teamwork"
              value={formData.soft.teamwork}
              onChange={(e) => handleChange('soft', 'teamwork', parseInt(e.target.value))}
              required
              min="1"
              max="5"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="problemSolving" className="block text-sm font-medium text-gray-700">
              Решение проблем (1-5)
            </label>
            <input
              type="number"
              id="problemSolving"
              value={formData.soft.problemSolving}
              onChange={(e) => handleChange('soft', 'problemSolving', parseInt(e.target.value))}
              required
              min="1"
              max="5"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="softComments" className="block text-sm font-medium text-gray-700">
              Комментарии по софт скиллам
            </label>
            <textarea
              id="softComments"
              value={formData.soft.comments}
              onChange={(e) => handleChange('soft', 'comments', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Итоговая оценка */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Итоговая оценка</h3>
        <div className="space-y-6">
          <div>
            <label htmlFor="generalComments" className="block text-sm font-medium text-gray-700">
              Общие комментарии
            </label>
            <textarea
              id="generalComments"
              value={formData.final.generalComments}
              onChange={(e) => handleChange('final', 'generalComments', e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="recommendation" className="block text-sm font-medium text-gray-700">
              Рекомендация
            </label>
            <select
              id="recommendation"
              value={formData.final.recommendation}
              onChange={(e) => handleChange('final', 'recommendation', e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            >
              <option value="Hire">Нанять</option>
              <option value="Consider">Рассмотреть</option>
              <option value="Need Additional Interview">Требуется дополнительное интервью</option>
              <option value="Reject">Отклонить</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
        >
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
}
