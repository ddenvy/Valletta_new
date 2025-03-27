import { useState, useRef } from 'react';
import Modal from '../common/Modal';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

export default function PhotoUploadModal({ isOpen, onClose, onUpload }: PhotoUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('File size should not exceed 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      await onUpload(selectedFile);
      onClose();
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Photo">
      <div className="p-4">
        {error && (
          <div className="mb-4 text-danger small">{error}</div>
        )}

        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="form-control"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200"
          >
            Select File
          </button>
        </div>

        {previewUrl && (
          <div className="mb-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="img-fluid rounded"
            />
          </div>
        )}

        <div className="d-flex justify-content-end gap-2">
          <button
            onClick={handleClose}
            className="btn btn-secondary"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`btn ${
              !selectedFile || isUploading
                ? 'btn-secondary cursor-not-allowed'
                : 'btn-primary hover:bg-blue-600'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
