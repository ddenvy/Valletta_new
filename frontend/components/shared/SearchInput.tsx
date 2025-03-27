'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  onSearch?: () => void;
  autoFocus?: boolean;
}

export default function SearchInput({
  placeholder = 'Поиск...',
  value,
  onChange,
  className = '',
  onSearch,
  autoFocus = false
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };
  
  const handleClear = () => {
    setInputValue('');
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  return (
    <div className={`position-relative ${className}`}>
      <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
        <MagnifyingGlassIcon className="icon-base w-4 h-4 text-muted" />
      </div>
      <input
        ref={inputRef}
        type="text"
        className="form-control form-control-sm ps-5"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      {inputValue && (
        <button
          type="button"
          className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent p-1"
          onClick={handleClear}
        >
          <XMarkIcon className="icon-base w-4 h-4 text-muted" />
        </button>
      )}
    </div>
  );
} 