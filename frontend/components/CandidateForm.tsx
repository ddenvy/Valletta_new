import React, { useState } from 'react';
import type { CandidateFormData } from '@/services/candidateService';
import axios from 'axios';

interface CandidateFormProps {
    onSave: (candidate: CandidateFormData) => Promise<boolean>;
    initialData?: CandidateFormData;
}

const STATUS_MAP = {
    'Новый': 'new',
    'Скрининг': 'screening',
    'Интервью': 'interviewing',
    'Тестовое задание': 'test_task',
    'Оффер': 'offered',
    'Отказ': 'rejected',
    'Принят': 'hired',
    'Архив': 'archived'
} as const;

const ENGLISH_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
const CURRENCIES = ['USD', 'EUR', 'RUB'] as const;

const STATUSES = Object.keys(STATUS_MAP);

export default function CandidateForm({ onSave, initialData }: CandidateFormProps) {
    const [formData, setFormData] = useState<CandidateFormData>(initialData || {
        nameRu: '',
        nameEn: '',
        email: '',
        phone: '',
        vacancy: '',
        techStack: '',
        status: 'new',
        statusComment: '',
        screeningDate: undefined,
        recruiter: '',
        telegram: '',
        locationCityCountry: '',
        englishLevel: '',
        minSalary: undefined,
        maxSalary: undefined,
        salaryCurrency: 'USD',
        skype: '',
        comments: ''
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [uploadingInterview, setUploadingInterview] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        console.log('Submitting form data:', formData);

        try {
            const success = await onSave(formData);
            if (success) {
                setFormData({
                    nameRu: '',
                    nameEn: '',
                    email: '',
                    phone: '',
                    vacancy: '',
                    techStack: '',
                    status: 'new',
                    statusComment: '',
                    screeningDate: undefined,
                    recruiter: '',
                    telegram: '',
                    locationCityCountry: '',
                    englishLevel: '',
                    minSalary: undefined,
                    maxSalary: undefined,
                    salaryCurrency: 'USD',
                    skype: '',
                    comments: ''
                });
            }
        } catch (err) {
            setError('Произошла ошибка при сохранении');
            console.error('Form submission error:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (name === 'status') {
            setFormData(prev => ({ 
                ...prev, 
                [name]: STATUS_MAP[value as keyof typeof STATUS_MAP] 
            }));
        } else if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: value === '' ? undefined : parseInt(value, 10)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileUpload = async (file: File, type: 'resume' | 'interview') => {
        const isResume = type === 'resume';
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            if (isResume) {
                setUploadingResume(true);
            } else {
                setUploadingInterview(true);
            }
            
            setError(null);

            const response = await axios.post('http://localhost:3001/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                const { fileName, fileUrl } = response.data.data;
                setFormData(prev => ({
                    ...prev,
                    ...(isResume 
                        ? { resumeFileName: fileName, resumeFileUrl: fileUrl }
                        : { interviewFile: fileUrl }
                    )
                }));
            }
        } catch (err) {
            console.error(`Error uploading ${type} file:`, err);
            setError(`Ошибка при загрузке ${type === 'resume' ? 'резюме' : 'файла интервью'}`);
        } finally {
            if (isResume) {
                setUploadingResume(false);
            } else {
                setUploadingInterview(false);
            }
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (!files || !files[0]) return;

        const file = files[0];
        const type = name === 'resumeFileName' ? 'resume' : 'interview';
        await handleFileUpload(file, type);
    };

    return (
        <div className="form-container" style={{ maxHeight: '80vh', overflowY: 'auto', position: 'sticky', top: '1rem' }}>
            <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded bg-light">
                <div className="row g-3">
                    {/* Основная информация */}
                    <div className="col-md-6">
                        <label htmlFor="nameRu" className="form-label">ФИО (рус)</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nameRu"
                            name="nameRu"
                            value={formData.nameRu}
                            onChange={handleChange}
                            required
                            placeholder="Иван Иванов"
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="nameEn" className="form-label">ФИО (англ)</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nameEn"
                            name="nameEn"
                            value={formData.nameEn}
                            onChange={handleChange}
                            required
                            placeholder="Ivan Ivanov"
                        />
                    </div>

                    {/* Контактная информация */}
                    <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="phone" className="form-label">Телефон</label>
                        <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Мессенджеры */}
                    <div className="col-md-6">
                        <label htmlFor="telegram" className="form-label">Telegram</label>
                        <input
                            type="text"
                            className="form-control"
                            id="telegram"
                            name="telegram"
                            value={formData.telegram}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="skype" className="form-label">Skype</label>
                        <input
                            type="text"
                            className="form-control"
                            id="skype"
                            name="skype"
                            value={formData.skype}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Профессиональная информация */}
                    <div className="col-md-6">
                        <label htmlFor="vacancy" className="form-label">Вакансия</label>
                        <input
                            type="text"
                            className="form-control"
                            id="vacancy"
                            name="vacancy"
                            value={formData.vacancy}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="techStack" className="form-label">Технический стек</label>
                        <input
                            type="text"
                            className="form-control"
                            id="techStack"
                            name="techStack"
                            value={formData.techStack}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Локация и английский */}
                    <div className="col-md-6">
                        <label htmlFor="locationCityCountry" className="form-label">Город/Страна</label>
                        <input
                            type="text"
                            className="form-control"
                            id="locationCityCountry"
                            name="locationCityCountry"
                            value={formData.locationCityCountry}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="englishLevel" className="form-label">Уровень английского</label>
                        <select
                            className="form-select"
                            id="englishLevel"
                            name="englishLevel"
                            value={formData.englishLevel}
                            onChange={handleChange}
                        >
                            <option value="">Выберите уровень</option>
                            {ENGLISH_LEVELS.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>

                    {/* Зарплатные ожидания */}
                    <div className="col-md-4">
                        <label htmlFor="minSalary" className="form-label">Мин. зарплата</label>
                        <input
                            type="number"
                            className="form-control"
                            id="minSalary"
                            name="minSalary"
                            value={formData.minSalary || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="maxSalary" className="form-label">Макс. зарплата</label>
                        <input
                            type="number"
                            className="form-control"
                            id="maxSalary"
                            name="maxSalary"
                            value={formData.maxSalary || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="salaryCurrency" className="form-label">Валюта</label>
                        <select
                            className="form-select"
                            id="salaryCurrency"
                            name="salaryCurrency"
                            value={formData.salaryCurrency}
                            onChange={handleChange}
                        >
                            {CURRENCIES.map(currency => (
                                <option key={currency} value={currency}>{currency}</option>
                            ))}
                        </select>
                    </div>

                    {/* Статус и скрининг */}
                    <div className="col-md-6">
                        <label htmlFor="status" className="form-label">Статус</label>
                        <select
                            className="form-select"
                            id="status"
                            name="status"
                            value={Object.entries(STATUS_MAP).find(([_, v]) => v === formData.status)?.[0] || 'Новый'}
                            onChange={handleChange}
                            required
                        >
                            {STATUSES.map(status => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="screeningDate" className="form-label">Дата скрининга</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            id="screeningDate"
                            name="screeningDate"
                            value={formData.screeningDate || ''}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Рекрутер и комментарии */}
                    <div className="col-md-6">
                        <label htmlFor="recruiter" className="form-label">Рекрутер</label>
                        <input
                            type="text"
                            className="form-control"
                            id="recruiter"
                            name="recruiter"
                            value={formData.recruiter}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="statusComment" className="form-label">Комментарий к статусу</label>
                        <input
                            type="text"
                            className="form-control"
                            id="statusComment"
                            name="statusComment"
                            value={formData.statusComment}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Файлы */}
                    <div className="col-md-6">
                        <label htmlFor="resumeFileName" className="form-label">Резюме</label>
                        <div className="input-group">
                            <input
                                type="file"
                                className="form-control"
                                id="resumeFileName"
                                name="resumeFileName"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.txt"
                            />
                            {uploadingResume && (
                                <span className="input-group-text">
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Загрузка...</span>
                                    </div>
                                </span>
                            )}
                        </div>
                        {formData.resumeFileName && (
                            <div className="small text-success mt-1">
                                Загружено: {formData.resumeFileName}
                            </div>
                        )}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Интервью</label>
                        <div>
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() => {
                                    // TODO: Добавить обработчик открытия формы интервью
                                    alert('Форма интервью будет доступна после сохранения кандидата');
                                }}
                            >
                                Создать форму интервью
                            </button>
                            <div className="small text-muted mt-1">
                                Форма интервью будет доступна после сохранения кандидата
                            </div>
                        </div>
                    </div>

                    {/* Общие комментарии */}
                    <div className="col-12">
                        <label htmlFor="comments" className="form-label">Комментарии</label>
                        <textarea
                            className="form-control"
                            id="comments"
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                        {error}
                    </div>
                )}

                <div className="text-end mt-3 sticky-bottom bg-light py-3" style={{ position: 'sticky', bottom: 0, borderTop: '1px solid #dee2e6' }}>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving}
                    >
                        {saving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </form>
        </div>
    );
} 