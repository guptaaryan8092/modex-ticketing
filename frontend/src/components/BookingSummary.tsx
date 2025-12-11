import { Loader2 } from 'lucide-react';

interface BookingSummaryProps {
    selectedCount: number;
    onConfirm: () => void;
    isSubmitting: boolean;
}

export const BookingSummary = ({ selectedCount, onConfirm, isSubmitting }: BookingSummaryProps) => {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 transform transition-transform duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">Selected</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedCount} <span className="text-base font-normal text-gray-500">seats</span></p>
                </div>
                <button
                    onClick={onConfirm}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Confirm Booking'
                    )}
                </button>
            </div>
        </div>
    );
};
