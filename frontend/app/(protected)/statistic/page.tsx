'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/services/axios';
import { DashboardStats } from '@/types/dashboard';
import { 
  ChartBarIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClockIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

export default function StatisticContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching dashboard stats...');
      const response = await axiosInstance.get('/dashboard/stats');
      const data = response.data;
      console.log('Received stats:', data);
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Не удалось загрузить статистику');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Загрузка статистики...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">Нет данных для отображения</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Статистика</h1>
      
      {/* Основные показатели */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Активные кандидаты */}
        <div className="bg-white overflow-hidden shadow rounded-lg border-2 border-black">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Активные кандидаты
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.activeCandidates}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Открытые вакансии */}
        <div className="bg-white overflow-hidden shadow rounded-lg border-2 border-black">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BriefcaseIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Открытые вакансии
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.openVacancies}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Собеседования за неделю */}
        <div className="bg-white overflow-hidden shadow rounded-lg border-2 border-black">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Собеседования за неделю
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.weeklyInterviews}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Нанято за месяц */}
        <div className="bg-white overflow-hidden shadow rounded-lg border-2 border-black">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Нанято за месяц
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.monthlyHires}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Среднее время найма */}
        <div className="bg-white overflow-hidden shadow rounded-lg border-2 border-black">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Среднее время найма
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stats.averageTimeToHire} дней
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Востребованные навыки */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Востребованные навыки
        </h2>
        <div className="bg-white shadow overflow-hidden border-2 border-black rounded-lg">
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {stats.topSkillsInDemand.map((skill, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg"
                >
                  <CodeBracketIcon className="h-5 w-5 text-gray-400 mb-2" />
                  <div className="text-sm font-medium text-gray-900">
                    {skill.skill}
                  </div>
                  <div className="text-sm text-gray-500">
                    {skill.count} вакансий
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 