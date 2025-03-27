'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
    onFileUpload: (files: File[]) => void;
    accept?: Record<string, string[]>;
    multiple?: boolean;
    maxSize?: number;
    label?: string;
}

export default function FileUpload({
    onFileUpload,
    accept = {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple = false,
    maxSize = 5242880, // 5MB
    label = 'Upload File'
}: FileUploadProps) {
    const [error, setError] = useState<string>('');

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        if (rejectedFiles.length > 0) {
            const errors = rejectedFiles.map(file => {
                if (file.errors[0].code === 'file-too-large') {
                    return 'File is too large. Maximum size is 5MB';
                }
                if (file.errors[0].code === 'file-invalid-type') {
                    return 'Invalid file type. Please upload PDF, DOC, or DOCX files';
                }
                return file.errors[0].message;
            });
            setError(errors.join(', '));
            return;
        }

        setError('');
        onFileUpload(acceptedFiles);
    }, [onFileUpload, maxSize]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple,
        maxSize
    });

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}
                    ${error ? 'border-red-500' : ''}`}
            >
                <input {...getInputProps()} />
                <div className="space-y-2">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className="text-sm text-gray-600">
                        {isDragActive ? (
                            <p>Drop the files here ...</p>
                        ) : (
                            <p>
                                {label} or drag and drop
                                <br />
                                PDF, DOC, DOCX up to 5MB
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
