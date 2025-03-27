'use client';

import { useState, useEffect } from 'react';
import { Candidate, CandidateStatus, CANDIDATE_STATUSES, ENGLISH_LEVELS, CURRENCIES, EnglishLevel, Currency } from '@/types/candidate';
import DynamicClientOnlyDateTime from '@/components/shared/DynamicClientOnlyDateTime';
import { useTheme } from '@/context/ThemeContext';
import {
    ChevronDownIcon,
    ChevronUpIcon,
    EnvelopeIcon,
    PhoneIcon,
    ChatBubbleLeftRightIcon,
    CheckIcon,
    XMarkIcon,
    PencilIcon,
    DocumentTextIcon,
    DocumentArrowDownIcon,
    LinkIcon,
    CurrencyDollarIcon,
    GlobeAltIcon,
    LanguageIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

// Обновляем стили для лучшей прокрутки
const candidatesTableStyles = `
.candidates-table {
    width: auto;
    min-width: 100%;
    font-size: 0.9rem;
    border-collapse: collapse;
}

.candidates-table tr {
    height: auto;
}

.candidates-table th {
    position: sticky;
    top: 0;
    background-color: var(--bs-body-bg);
    z-index: 1;
    border-bottom: 2px solid var(--bs-border-color);
    padding: 0.4rem 0.5rem;
    font-size: 0.85rem;
}

.candidates-table td {
    padding: 0.3rem 0.5rem;
    vertical-align: middle;
    max-width: 100%;
    overflow: hidden;
    border-top: 1px solid var(--bs-border-color-translucent);
}

.candidates-table .editable-cell {
    cursor: pointer;
    transition: background-color 0.2s;
    padding: 0.4rem;
    border-radius: 0.25rem;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
}

.candidates-table .editable-cell:hover {
    background-color: rgba(var(--bs-primary-rgb), 0.05);
}

[data-bs-theme=dark] .candidates-table .editable-cell:hover {
    background-color: rgba(255,255,255,0.1);
}

.candidates-table-container {
    height: 100%;
    overflow-y: auto;
    overflow-x: auto;
}

.candidates-table th {
    white-space: nowrap;
    vertical-align: middle;
}

.candidates-table .multiline-cell {
    white-space: normal;
    min-width: 150px;
    max-width: 150px;
}

.candidates-table td.text-cell {
    white-space: normal;
}

.candidates-table td.salary-cell {
    white-space: nowrap;
    min-width: 120px;
}

.status-badge {
    padding: 0.25em 0.5em;
    font-size: 0.85em;
    border-radius: 0.25rem;
}

.candidates-table .icon-sm {
    width: 0.875rem;
    height: 0.875rem;
}

.candidates-table .btn-xs {
    padding: 0.2rem 0.4rem;
    font-size: 0.75rem;
    line-height: 1.2;
}

.candidates-table td .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
}
`;

interface CandidatesListProps {
    candidates: Candidate[];
    onUpdateCandidate: (updatedCandidate: Candidate) => void;
    onEditCandidate: (candidate: Candidate) => void;
    onDeleteCandidate: (candidateId: string) => void;
    onAddCandidate: () => void;
}

// Тип для редактируемой ячейки
type EditableCell = {
    candidateId: string;
    field: keyof Candidate;
};

const CandidatesList: React.FC<CandidatesListProps> = ({ 
    candidates: initialCandidates, 
    onUpdateCandidate, 
    onEditCandidate, 
    onDeleteCandidate, 
    onAddCandidate 
}) => {
    const { theme } = useTheme();
    const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
    const [sortField, setSortField] = useState<keyof Candidate | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [editableCell, setEditableCell] = useState<EditableCell | null>(null);
    const [editValue, setEditValue] = useState<string>('');
    
    // Добавляем состояние для модального окна подтверждения удаления
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    
    const [editMode, setEditMode] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
    const [editingField, setEditingField] = useState<string | null>(null);
    // Добавляем состояние для хранения позиции редактирования
    const [editPosition, setEditPosition] = useState<{ top: number; left: number } | null>(null);
    
    // Сортировка кандидатов
    const sortedCandidates = [...candidates].sort((a, b) => {
        const fieldA = a[sortField || 'timestamp'];
        const fieldB = b[sortField || 'timestamp'];
        
        if (fieldA === undefined || fieldA === null) return sortDirection === 'asc' ? -1 : 1;
        if (fieldB === undefined || fieldB === null) return sortDirection === 'asc' ? 1 : -1;
        
        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
            return sortDirection === 'asc' 
                ? fieldA.localeCompare(fieldB) 
                : fieldB.localeCompare(fieldA);
        }
        
        // Для числовых полей
        if (typeof fieldA === 'number' && typeof fieldB === 'number') {
            return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
        }
        
        // Для дат
        if (fieldA instanceof Date && fieldB instanceof Date) {
            return sortDirection === 'asc' 
                ? fieldA.getTime() - fieldB.getTime() 
                : fieldB.getTime() - fieldA.getTime();
        }
        
        // Для строковых представлений дат
        if (
            typeof fieldA === 'string' && 
            typeof fieldB === 'string' && 
            !isNaN(Date.parse(fieldA)) && 
            !isNaN(Date.parse(fieldB))
        ) {
            const dateA = new Date(fieldA);
            const dateB = new Date(fieldB);
            return sortDirection === 'asc' 
                ? dateA.getTime() - dateB.getTime() 
                : dateB.getTime() - dateA.getTime();
        }
        
        return 0;
    });
    
    const handleSort = (field: keyof Candidate) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };
    
    const startEditing = (candidate: Candidate, field: keyof Candidate) => {
        setEditableCell({ candidateId: candidate.id, field });
        setEditValue(String(candidate[field] || ''));
        setEditingCandidate({...candidate});
        setEditingField(field as string);
        setEditMode(true);
        
        // Находим элемент ячейки для позиционирования редактора
        setTimeout(() => {
            const cellElement = document.querySelector(`[data-candidate-id="${candidate.id}"][data-field="${field}"]`);
            if (cellElement) {
                const rect = cellElement.getBoundingClientRect();
                setEditPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX
                });
            }
        }, 0);
    };
    
    const handleUpdate = (updatedCandidate: Candidate) => {
        onUpdateCandidate(updatedCandidate);
        cancelEdit();
    };
    
    const cancelEdit = () => {
        setEditableCell(null);
        setEditValue('');
    };
    
    const SortIcon = ({ field }: { field: keyof Candidate }) => {
        if (field !== sortField) return null;
        
        return sortDirection === 'asc' 
            ? <ChevronUpIcon className="icon-sm ms-1" /> 
            : <ChevronDownIcon className="icon-sm ms-1" />;
    };
    
    const getStatusColor = (status: string | undefined) => {
        if (!status) return 'secondary';
        
        switch (status) {
            case 'Новый': 
                return 'primary';
            case 'Скрининг': 
                return 'info';
            case 'Интервью': 
                return 'warning';
            case 'Тестовое задание': 
                return 'warning';
            case 'Оффер': 
                return 'success';
            case 'Отказ': 
                return 'danger';
            case 'Принят': 
                return 'success';
            case 'Архив': 
                return 'secondary';
            default: 
                return 'secondary';
        }
    };
    
    // Функция для отображения редактируемой ячейки
    const renderEditableCell = (candidate: Candidate, field: keyof Candidate, value: any) => {
        // Если значение отсутствует, отображаем плейсхолдер
        if (value === null || value === undefined || value === '') {
            return <span className="text-muted">—</span>;
        }

        // Специальная обработка для даты и времени
        if (field === 'timestamp' || field === 'screeningDate' || field === 'statusUpdateDate') {
            return (
                <div 
                    className="editable-cell"
                    onDoubleClick={() => startEditing(candidate, field)}
                    data-candidate-id={candidate.id}
                    data-field={field}
                >
                    <DynamicClientOnlyDateTime
                        date={value}
                        format="dd.MM.yyyy"
                    />
                </div>
            );
        }

        // Специальная обработка для статуса
        if (field === 'status') {
            return (
                <div 
                    className="editable-cell"
                    onDoubleClick={() => startEditing(candidate, field)}
                    data-candidate-id={candidate.id}
                    data-field={field}
                >
                    <span className={`status-badge status-${value}`}>
                        {value === 'Тестовое задание' ? 'Тест. задание' : value}
                    </span>
                </div>
            );
        }

        // Для URL полей отображаем ссылки
        if (field === 'resumeUrl' || field === 'interviewFileUrl') {
            return (
                <div 
                    className="editable-cell"
                    onDoubleClick={() => startEditing(candidate, field)}
                    data-candidate-id={candidate.id}
                    data-field={field}
                >
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                        {field === 'resumeUrl' ? 'Резюме' : 'Интервью'}
                    </a>
                </div>
            );
        }

        // Для всех остальных полей
        return (
            <div 
                className="editable-cell text-cell" 
                onDoubleClick={() => startEditing(candidate, field)}
                title="Дважды нажмите для редактирования"
                data-candidate-id={candidate.id}
                data-field={field}
            >
                {value}
            </div>
        );
    };
    
    // Функция для подтверждения удаления
    const confirmDelete = (id: string) => {
        setConfirmDeleteId(id);
        setShowDeleteConfirm(true);
    };
    
    // Функция удаления после подтверждения
    const handleConfirmDelete = () => {
        if (confirmDeleteId) {
            onDeleteCandidate(confirmDeleteId);
            setShowDeleteConfirm(false);
            setConfirmDeleteId(null);
        }
    };
    
    // Функция отмены удаления
    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setConfirmDeleteId(null);
    };
    
    // Компонент для отображения полной информации о зарплате
    const renderSalaryInfo = (candidate: Candidate) => {
        let salaryText = '—';
        
        if (candidate.salaryMin && candidate.salaryMax) {
            if (candidate.salaryMin === candidate.salaryMax) {
                salaryText = `${candidate.salaryMin.toLocaleString()}`;
            } else {
                salaryText = `${candidate.salaryMin.toLocaleString()} - ${candidate.salaryMax.toLocaleString()}`;
            }
        } else if (candidate.salaryMin) {
            salaryText = `от ${candidate.salaryMin.toLocaleString()}`;
        } else if (candidate.salaryMax) {
            salaryText = `до ${candidate.salaryMax.toLocaleString()}`;
        }
        
        if (candidate.salaryCurrency) {
            salaryText += ` ${candidate.salaryCurrency}`;
        }
        
        return (
            <div 
                className="editable-cell"
                onClick={(e) => handleCellClick(candidate, 'salary', e)}
                title="Нажмите для редактирования зарплаты"
                data-candidate-id={candidate.id}
                data-field="salary"
            >
                {salaryText}
            </div>
        );
    };
    
    // Обновляем useEffect для инициализации кандидатов при изменении initialCandidates
    useEffect(() => {
        setCandidates(initialCandidates);
    }, [initialCandidates]);

    // Компонент для отображения редактора зарплаты
    const renderSalaryEditor = () => {
        if (!editingCandidate || !editPosition) return null;
        
        const handleSalaryChange = (field: 'salaryMin' | 'salaryMax', value: string) => {
            if (editingCandidate) {
                const numValue = value === '' ? undefined : Number(value);
                setEditingCandidate({
                    ...editingCandidate,
                    [field]: numValue
                });
            }
        };
        
        const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            if (editingCandidate) {
                setEditingCandidate({
                    ...editingCandidate,
                    salaryCurrency: e.target.value as Currency
                });
            }
        };
        
        const handleSaveClick = () => {
            if (editingCandidate) {
                onUpdateCandidate(editingCandidate);
                setEditMode(false);
                setEditingCandidate(null);
                setEditingField(null);
                setEditPosition(null);
            }
        };
        
        const handleCancelClick = () => {
            setEditMode(false);
            setEditingCandidate(null);
            setEditingField(null);
            setEditPosition(null);
        };
        
        return (
            <div className={`salary-editor p-3 border rounded position-fixed ${theme === 'dark' ? 'dark-theme-salary-editor' : ''}`} 
                 style={{ 
                    top: `${editPosition.top}px`, 
                    left: `${editPosition.left}px` 
                 }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Редактирование зарплаты</h6>
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={handleCancelClick} 
                        aria-label="Закрыть">
                    </button>
                </div>
                <div className="mb-2">
                    <label className="form-label">Мин. зарплата</label>
                    <input
                        type="number"
                        className="form-control"
                        value={editingCandidate.salaryMin || ''}
                        onChange={(e) => handleSalaryChange('salaryMin', e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Макс. зарплата</label>
                    <input
                        type="number"
                        className="form-control"
                        value={editingCandidate.salaryMax || ''}
                        onChange={(e) => handleSalaryChange('salaryMax', e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Валюта</label>
                    <select
                        className="form-select"
                        value={editingCandidate.salaryCurrency || 'RUB'}
                        onChange={handleCurrencyChange}
                    >
                        {CURRENCIES.map((currency) => (
                            <option key={currency} value={currency}>
                                {currency}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-sm btn-primary" onClick={handleSaveClick}>
                        Сохранить
                    </button>
                </div>
            </div>
        );
    };

    // Обработчик клика по ячейке с передачей события для позиционирования
    const handleCellClick = (candidate: Candidate, field: string, e?: React.MouseEvent) => {
        if (e) {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            setEditPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX
            });
        }
        setEditingCandidate({...candidate});
        setEditingField(field);
        setEditMode(true);
    };

    return (
        <>
            {/* Добавляем CSS стили */}
            <style jsx>{candidatesTableStyles}</style>
            
            <div style={{
                border: '1px solid var(--bs-border-color)',
                borderRadius: '0.375rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: '100%',
                    flexGrow: 1,
                    overflow: 'hidden'
                }} className="candidates-table-container">
                    {/* Отображаем редактор зарплаты, если активно редактирование */}
                    {editMode && editingField === 'salary' && renderSalaryEditor()}
                    
                    <table className="table table-hover candidates-table w-100 mb-0">
                        <thead>
                            <tr>
                                <th scope="col" className="user-select-none" style={{ minWidth: '80px', width: '80px' }}>
                                    <div 
                                        className="d-flex align-items-center cursor-pointer" 
                                        onClick={() => handleSort('timestamp')}
                                    >
                                        Дата <SortIcon field="timestamp" />
                                    </div>
                                </th>
                                <th scope="col" className="user-select-none" style={{ minWidth: '110px', width: '110px' }}>
                                    <div 
                                        className="d-flex align-items-center cursor-pointer" 
                                        onClick={() => handleSort('nameRu')}
                                    >
                                        Имя <SortIcon field="nameRu" />
                                    </div>
                                </th>
                                <th scope="col" className="user-select-none" style={{ minWidth: '110px', width: '110px' }}>
                                    <div 
                                        className="d-flex align-items-center cursor-pointer" 
                                        onClick={() => handleSort('nameEn')}
                                    >
                                        EN <SortIcon field="nameEn" />
                                    </div>
                                </th>
                                <th scope="col" className="user-select-none" style={{ minWidth: '120px', width: '120px' }}>
                                    <div 
                                        className="d-flex align-items-center cursor-pointer" 
                                        onClick={() => handleSort('vacancy')}
                                    >
                                        Вакансия <SortIcon field="vacancy" />
                                    </div>
                                </th>
                                <th scope="col" className="user-select-none" style={{ minWidth: '100px', width: '100px' }}>
                                    <div 
                                        className="d-flex align-items-center cursor-pointer" 
                                        onClick={() => handleSort('stack')}
                                    >
                                        Стек <SortIcon field="stack" />
                                    </div>
                                </th>
                                <th scope="col" className="user-select-none" style={{ minWidth: '80px', width: '80px' }}>
                                    <div 
                                        className="d-flex align-items-center cursor-pointer" 
                                        onClick={() => handleSort('status')}
                                    >
                                        Статус <SortIcon field="status" />
                                    </div>
                                </th>
                                <th scope="col" className="user-select-none" style={{ minWidth: '130px', width: '130px' }}>
                                    <div 
                                        className="d-flex align-items-center cursor-pointer" 
                                        onClick={() => handleSort('statusComment')}
                                    >
                                        Коммент. <SortIcon field="statusComment" />
                                    </div>
                                </th>
                                <th scope="col" className="user-select-none" style={{ minWidth: '90px', width: '90px' }}>
                                    <div 
                                        className="d-flex align-items-center cursor-pointer" 
                                        onClick={() => handleSort('screeningDate')}
                                    >
                                        Скрининг <SortIcon field="screeningDate" />
                                    </div>
                                </th>
                                <th scope="col" className="user-select-none" style={{ minWidth: '70px', width: '70px' }}>
                                    <div 
                                        className="d-flex align-items-center cursor-pointer" 
                                        onClick={() => handleSort('location')}
                                    >
                                        Локация <SortIcon field="location" />
                                    </div>
                                </th>
                                <th scope="col" className="user-select-none" style={{ minWidth: '50px', width: '50px' }}>
                                    <div 
                                        className="d-flex align-items-center cursor-pointer" 
                                        onClick={() => handleSort('englishLevel')}
                                    >
                                        EN <SortIcon field="englishLevel" />
                                    </div>
                                </th>
                                <th scope="col" className="user-select-none" style={{ minWidth: '90px', width: '90px' }}>
                                    <div 
                                        className="d-flex align-items-center cursor-pointer" 
                                        onClick={() => handleSort('salaryMin')}
                                    >
                                        Зарплата <SortIcon field="salaryMin" />
                                    </div>
                                </th>
                                <th scope="col" className="user-select-none" style={{ minWidth: '140px', width: '140px' }}>
                                    <div className="d-flex align-items-center">
                                        Контакты
                                    </div>
                                </th>
                                <th scope="col" className="user-select-none" style={{ minWidth: '90px', width: '90px' }}>
                                    <div className="d-flex align-items-center">
                                        Документы
                                    </div>
                                </th>
                                <th scope="col" className="text-end" style={{ minWidth: '60px', width: '60px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedCandidates.map((candidate) => (
                                <tr key={candidate.id}>
                                    <td style={{ maxWidth: '80px' }}>{renderEditableCell(candidate, 'timestamp', candidate.timestamp)}</td>
                                    <td className="text-cell" style={{ maxWidth: '110px' }}>{renderEditableCell(candidate, 'nameRu', candidate.nameRu)}</td>
                                    <td className="text-cell" style={{ maxWidth: '110px' }}>{renderEditableCell(candidate, 'nameEn', candidate.nameEn)}</td>
                                    <td className="text-cell" style={{ maxWidth: '120px' }}>{renderEditableCell(candidate, 'vacancy', candidate.vacancy)}</td>
                                    <td className="text-cell" style={{ maxWidth: '100px' }}>{renderEditableCell(candidate, 'stack', candidate.stack)}</td>
                                    <td style={{ maxWidth: '80px' }}>{renderEditableCell(candidate, 'status', candidate.status)}</td>
                                    <td className="text-cell" style={{ minWidth: '130px', maxWidth: '130px' }}>{renderEditableCell(candidate, 'statusComment', candidate.statusComment)}</td>
                                    <td style={{ maxWidth: '90px' }}>{renderEditableCell(candidate, 'screeningDate', candidate.screeningDate)}</td>
                                    <td className="text-cell" style={{ maxWidth: '70px' }}>{renderEditableCell(candidate, 'location', candidate.location)}</td>
                                    <td style={{ maxWidth: '50px' }}>{renderEditableCell(candidate, 'englishLevel', candidate.englishLevel)}</td>
                                    <td className="salary-cell" style={{ maxWidth: '90px' }}>
                                        {renderSalaryInfo(candidate)}
                                    </td>
                                    <td style={{ maxWidth: '140px' }}>
                                        <div className="d-flex flex-column gap-1">
                                            {renderEditableCell(candidate, 'email', candidate.email)}
                                            {renderEditableCell(candidate, 'phone', candidate.phone)}
                                            {renderEditableCell(candidate, 'telegram', candidate.telegram)}
                                            {renderEditableCell(candidate, 'skype', candidate.skype)}
                                        </div>
                                    </td>
                                    <td style={{ maxWidth: '90px' }}>
                                        <div className="d-flex flex-column gap-2">
                                            {renderEditableCell(candidate, 'resumeUrl', candidate.resumeUrl)}
                                            {renderEditableCell(candidate, 'interviewFileUrl', candidate.interviewFileUrl)}
                                        </div>
                                    </td>
                                    <td style={{ width: '60px' }}>
                                        <div className="d-flex justify-content-end gap-1">
                                            {onEditCandidate && (
                                                <button
                                                    onClick={() => onEditCandidate(candidate)}
                                                    className="btn btn-sm btn-outline-primary btn-xs"
                                                    title="Редактировать кандидата"
                                                >
                                                    <PencilSquareIcon className="icon-sm" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => confirmDelete(candidate.id)}
                                                className="btn btn-sm btn-outline-danger btn-xs"
                                                title="Удалить кандидата"
                                            >
                                                <TrashIcon className="icon-sm" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Модальное окно подтверждения удаления */}
            <div className={`modal fade ${showDeleteConfirm ? 'show' : ''}`} 
                 style={{ display: showDeleteConfirm ? 'block' : 'none' }}
                 tabIndex={-1} 
                 role="dialog"
                 aria-labelledby="deleteConfirmModalLabel"
                 aria-hidden={!showDeleteConfirm}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteConfirmModalLabel">Подтверждение удаления</h5>
                            <button type="button" className="btn-close" onClick={handleCancelDelete}></button>
                        </div>
                        <div className="modal-body">
                            Вы уверены, что хотите удалить этого кандидата?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>Отмена</button>
                            <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Удалить</button>
                        </div>
                    </div>
                </div>
                <div className="modal-backdrop fade show"></div>
            </div>
        </>
    );
}

export default CandidatesList;
