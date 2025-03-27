import React, { useState, useEffect } from 'react';
import { candidateService, Candidate } from '../services/candidateService';

interface CandidateForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    status: 'new' | 'interviewing' | 'offered' | 'hired' | 'rejected';
}

const initialFormState: CandidateForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    status: 'new'
};

export default function CandidateTest() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [error, setError] = useState<string>('');
    const [formData, setFormData] = useState<CandidateForm>(initialFormState);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        try {
            const data = await candidateService.getAllCandidates();
            setCandidates(data);
            setError('');
        } catch (err) {
            setError('Ошибка при загрузке кандидатов');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && editingId) {
                const updatedCandidate = await candidateService.updateCandidate(editingId, formData);
                setCandidates(candidates.map(c => c.id === editingId ? updatedCandidate : c));
            } else {
                const newCandidate = await candidateService.createCandidate(formData);
                setCandidates([newCandidate, ...candidates]);
            }
            setFormData(initialFormState);
            setIsEditing(false);
            setEditingId(null);
            setError('');
        } catch (err) {
            setError(isEditing ? 'Ошибка при обновлении кандидата' : 'Ошибка при создании кандидата');
        }
    };

    const handleEdit = (candidate: Candidate) => {
        setFormData({
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            phone: candidate.phone,
            position: candidate.position,
            status: candidate.status
        });
        setIsEditing(true);
        setEditingId(candidate.id);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить этого кандидата?')) {
            try {
                await candidateService.deleteCandidate(id);
                setCandidates(candidates.filter(c => c.id !== id));
                setError('');
            } catch (err) {
                setError('Ошибка при удалении кандидата');
            }
        }
    };

    const handleCancel = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setEditingId(null);
    };

    return (
        <div className="container mt-4">
            <h1>Управление кандидатами</h1>
            
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mb-4">
                <div className="row g-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            placeholder="Имя"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            placeholder="Фамилия"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            placeholder="Телефон"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            name="position"
                            placeholder="Должность"
                            value={formData.position}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <select
                            className="form-select"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="new">Новый</option>
                            <option value="interviewing">На собеседовании</option>
                            <option value="offered">Получил оффер</option>
                            <option value="hired">Нанят</option>
                            <option value="rejected">Отклонен</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary me-2">
                            {isEditing ? 'Обновить' : 'Создать'}
                        </button>
                        {isEditing && (
                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                Отмена
                            </button>
                        )}
                    </div>
                </div>
            </form>

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Фамилия</th>
                            <th>Email</th>
                            <th>Телефон</th>
                            <th>Должность</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map(candidate => (
                            <tr key={candidate.id}>
                                <td>{candidate.id}</td>
                                <td>{candidate.firstName}</td>
                                <td>{candidate.lastName}</td>
                                <td>{candidate.email}</td>
                                <td>{candidate.phone}</td>
                                <td>{candidate.position}</td>
                                <td>{candidate.status}</td>
                                <td>
                                    <button 
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => handleEdit(candidate)}
                                    >
                                        Изменить
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(candidate.id)}
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 