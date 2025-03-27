import { Dialog } from '@headlessui/react';
import InterviewForm from './InterviewForm';
import { InterviewFormData } from '@/types/interview';

interface InterviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (interview: InterviewFormData) => Promise<void>;
    candidateId: string;
}

export default function InterviewModal({ isOpen, onClose, onSubmit, candidateId }: InterviewModalProps) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full mx-4 p-6">
                    <Dialog.Title className="text-xl font-semibold mb-6">
                        Create Interview Record
                    </Dialog.Title>

                    <InterviewForm
                        candidateId={candidateId}
                        onSubmit={onSubmit}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </Dialog>
    );
}
