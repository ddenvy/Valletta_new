'use client';

import { useState, useEffect } from 'react';
import { Candidate, CandidateStatus, CANDIDATE_STATUSES, ENGLISH_LEVELS, CURRENCIES, EnglishLevel, Currency } from '@/types/candidate';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AddCandidateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (candidate: Omit<Candidate, 'id'>) => void;
    candidate?: Candidate;
    title?: string;
}

export default function AddCandidateModal({ 
    isOpen, 
    onClose, 
    onSave, 
    candidate,
    title = 'Добавить кандидата'
}: AddCandidateModalProps) {
    const [formData, setFormData] = useState<Omit<Candidate, 'id'>>({
        nameRu: '',
        nameEn: '',
        email: '',
        timestamp: new Date().toISOString(),
        resumeUrl: '',
        vacancy: '',
        stack: '',
        status: 'Новый' as CandidateStatus,
        statusUpdateDate: new Date().toISOString(),
        statusComment: '',
        location: '',
        englishLevel: 'B1' as EnglishLevel,
        phone: '',
        telegram: '',
        skype: '',
        salaryMin: undefined,
        salaryMax: undefined,
        salaryCurrency: undefined,
        screeningDate: undefined,
        screeningRecruiter: '',
        tags: []
    });
    
    useEffect(() => {
        if (candidate) {
            setFormData({
                nameRu: candidate.nameRu || '',
                nameEn: candidate.nameEn || '',
                email: candidate.email || '',
                timestamp: candidate.timestamp || new Date().toISOString(),
                resumeUrl: candidate.resumeUrl || '',
                vacancy: candidate.vacancy || '',
                stack: candidate.stack || '',
                status: candidate.status || 'Новый',
                statusUpdateDate: candidate.statusUpdateDate || new Date().toISOString(),
                statusComment: candidate.statusComment || '',
                location: candidate.location || '',
                englishLevel: candidate.englishLevel,
                phone: candidate.phone || '',
                telegram: candidate.telegram || '',
                skype: candidate.skype || '',
                salaryMin: candidate.salaryMin,
                salaryMax: candidate.salaryMax,
                salaryCurrency: candidate.salaryCurrency,
                screeningDate: candidate.screeningDate,
                screeningRecruiter: candidate.screeningRecruiter || '',
                interviewFileUrl: candidate.interviewFileUrl || '',
                tags: candidate.tags || []
            });
        }
    }, [candidate]);
    
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        
        // Обработка числовых полей
        if (name === 'salaryMin' || name === 'salaryMax') {
            setFormData({
                ...formData,
                [name]: value ? parseInt(value) : undefined
            });
            return;
        }
        
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };
    
    if (!isOpen) return null;
    
    return (
        <div 
            className="modal fade show" 
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} 
            tabIndex={-1} 
            role="dialog"
            aria-modal="true"
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nameRu"
                                            name="nameRu"
                                            placeholder="Имя (RU)"
                                            value={formData.nameRu}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label htmlFor="nameRu">Имя (RU)</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nameEn"
                                            name="nameEn"
                                            placeholder="Имя (EN)"
                                            value={formData.nameEn}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="nameEn">Имя (EN)</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label htmlFor="email">Email</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="phone"
                                            name="phone"
                                            placeholder="Телефон"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="phone">Телефон</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="telegram"
                                            name="telegram"
                                            placeholder="Telegram"
                                            value={formData.telegram}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="telegram">Telegram</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="skype"
                                            name="skype"
                                            placeholder="Skype"
                                            value={formData.skype}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="skype">Skype</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="vacancy"
                                            name="vacancy"
                                            placeholder="Вакансия"
                                            value={formData.vacancy}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label htmlFor="vacancy">Вакансия</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="stack"
                                            name="stack"
                                            placeholder="Стек"
                                            value={formData.stack}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="stack">Стек технологий</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <select
                                            className="form-select"
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            required
                                        >
                                            {CANDIDATE_STATUSES.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="status">Статус</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="location"
                                            name="location"
                                            placeholder="Локация"
                                            value={formData.location}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="location">Локация</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row mb-3">
                                <div className="col-md-12">
                                    <div className="form-floating mb-3">
                                        <textarea
                                            className="form-control"
                                            id="statusComment"
                                            name="statusComment"
                                            placeholder="Комментарий к статусу"
                                            value={formData.statusComment}
                                            onChange={handleChange}
                                            style={{ height: '100px' }}
                                        ></textarea>
                                        <label htmlFor="statusComment">Комментарий к статусу</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <select
                                            className="form-select"
                                            id="englishLevel"
                                            name="englishLevel"
                                            value={formData.englishLevel || ''}
                                            onChange={handleChange}
                                        >
                                            <option value="">Не указан</option>
                                            {ENGLISH_LEVELS.map((level) => (
                                                <option key={level} value={level}>
                                                    {level}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="englishLevel">Уровень английского</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="screeningDate"
                                            name="screeningDate"
                                            value={formData.screeningDate 
                                                ? new Date(formData.screeningDate).toISOString().split('T')[0] 
                                                : ''}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="screeningDate">Дата скрининга</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="screeningRecruiter"
                                            name="screeningRecruiter"
                                            placeholder="Рекрутер"
                                            value={formData.screeningRecruiter}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="screeningRecruiter">Рекрутер</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="url"
                                            className="form-control"
                                            id="resumeUrl"
                                            name="resumeUrl"
                                            placeholder="Ссылка на резюме"
                                            value={formData.resumeUrl}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="resumeUrl">Ссылка на резюме</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="url"
                                            className="form-control"
                                            id="interviewFileUrl"
                                            name="interviewFileUrl"
                                            placeholder="Ссылка на запись интервью"
                                            value={formData.interviewFileUrl || ''}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="interviewFileUrl">Ссылка на запись интервью</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row mb-3">
                                <h6 className="mb-3">Зарплатные ожидания</h6>
                                <div className="col-md-4">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="salaryMin"
                                            name="salaryMin"
                                            placeholder="Зарплата от"
                                            value={formData.salaryMin || ''}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="salaryMin">Зарплата от</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="salaryMax"
                                            name="salaryMax"
                                            placeholder="Зарплата до"
                                            value={formData.salaryMax || ''}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="salaryMax">Зарплата до</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-floating mb-3">
                                        <select
                                            className="form-select"
                                            id="salaryCurrency"
                                            name="salaryCurrency"
                                            value={formData.salaryCurrency || ''}
                                            onChange={handleChange}
                                        >
                                            <option value="">Не указана</option>
                                            {CURRENCIES.map((currency) => (
                                                <option key={currency} value={currency}>
                                                    {currency}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="salaryCurrency">Валюта</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                >
                                    Отмена
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                >
                                    Сохранить
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 