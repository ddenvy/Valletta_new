'use client';

import React, { useState, useEffect } from 'react';
import { candidateService, type Candidate, type CandidateFormData } from '@/services/candidateService';
import CandidateForm from '@/components/CandidateForm';
import CandidateList from '@/components/CandidateList';
import axios from 'axios';

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        try {
            setLoading(true);
            const data = await candidateService.getAllCandidates();
            if (Array.isArray(data)) {
                setCandidates(data);
                setError(null);
            } else {
                console.error('Unexpected response format:', data);
                setError('Неверный формат данных от сервера');
            }
        } catch (err) {
            console.error('Error loading candidates:', err);
            if (axios.isAxiosError(err) && err.response) {
                console.error('Server response data:', err.response.data);
                console.error('Server response status:', err.response.status);
                console.error('Server response headers:', err.response.headers);
            }
            setError('Ошибка при загрузке кандидатов. См. консоль для деталей.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCandidate = async (candidateData: CandidateFormData) => {
        try {
            const newCandidate = await candidateService.createCandidate(candidateData);
            setCandidates([newCandidate, ...candidates]);
            setError(null);
            setShowForm(false);
            return true;
        } catch (err) {
            console.error('Error creating candidate:', err);
            setError('Ошибка при создании кандидата');
            return false;
        }
    };

    const handleUpdateCandidate = async (id: string, candidateData: CandidateFormData) => {
        try {
            const updatedCandidate = await candidateService.updateCandidate(id, candidateData);
            setCandidates(candidates.map(c => c.id === id ? updatedCandidate : c));
            setError(null);
            return true;
        } catch (err) {
            console.error('Error updating candidate:', err);
            setError('Ошибка при обновлении кандидата');
            return false;
        }
    };

    const handleDeleteCandidate = async (id: string) => {
        try {
            await candidateService.deleteCandidate(id);
            setCandidates(candidates.filter(c => c.id !== id));
            setError(null);
            return true;
        } catch (err) {
            console.error('Error deleting candidate:', err);
            setError('Ошибка при удалении кандидата');
            return false;
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Управление кандидатами</h1>
                <button 
                    className="btn btn-primary" 
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Закрыть форму' : 'Добавить кандидата'}
                </button>
            </div>
            
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {showForm && <CandidateForm onSave={handleSaveCandidate} />}
            
            <CandidateList 
                candidates={candidates}
                onUpdate={handleUpdateCandidate}
                onDelete={handleDeleteCandidate}
            />
        </div>
    );
}
