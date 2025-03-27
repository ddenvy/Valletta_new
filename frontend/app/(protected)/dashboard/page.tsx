'use client';

import React, { useState, useEffect } from 'react';
import { DashboardData, Activity, Event } from '@/types/dashboard';
import DynamicClientOnlyDateTime from '@/components/shared/DynamicClientOnlyDateTime';
import DashboardFallback from './page-fallback';

// Основной компонент Dashboard
export default function DashboardContent() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardFallback />;
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning" role="alert">
          Нет данных для отображения
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Панель управления</h1>
      </div>
      
      <div className="dashboard-container">
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h5 className="dashboard-card-title">Активные кандидаты</h5>
            </div>
            <div className="dashboard-card-content">
              <div className="dashboard-stat">
                <span className="dashboard-stat-value">{dashboardData.stats.activeCandidatesCount}</span>
                <span className="dashboard-stat-label">кандидатов</span>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h5 className="dashboard-card-title">Открытые вакансии</h5>
            </div>
            <div className="dashboard-card-content">
              <div className="dashboard-stat">
                <span className="dashboard-stat-value">{dashboardData.stats.openVacanciesCount}</span>
                <span className="dashboard-stat-label">вакансий</span>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h5 className="dashboard-card-title">Интервью на этой неделе</h5>
            </div>
            <div className="dashboard-card-content">
              <div className="dashboard-stat">
                <span className="dashboard-stat-value">{dashboardData.stats.weeklyInterviewsCount}</span>
                <span className="dashboard-stat-label">интервью</span>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h5 className="dashboard-card-title">Недавние активности</h5>
            </div>
            <div className="dashboard-card-content">
              <div className="list-group list-group-flush">
                {dashboardData.recentActivities.map((activity: Activity) => (
                  <div key={activity.id} className="list-group-item px-0">
                    <div className="d-flex justify-content-between">
                      <h6 className="mb-1">{activity.title}</h6>
                      <small className="text-muted">
                        <DynamicClientOnlyDateTime date={activity.timestamp} format="datetime" />
                      </small>
                    </div>
                    <p className="mb-1 text-muted">{activity.description}</p>
                    <small className="text-muted">от {activity.userName}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
