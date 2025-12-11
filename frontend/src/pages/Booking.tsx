import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShowsApi } from '../hooks/useShowsApi';
import { useOptimisticBooking } from '../hooks/useOptimisticBooking';
import { SeatGrid } from '../components/SeatGrid';
import { BookingSummary } from '../components/BookingSummary';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import type { SeatMap } from '../types';

export default function Booking() {
    const { id } = useParams<{ id: string }>();
    const { fetchSeatMap, bookSeats, loading: apiLoading } = useShowsApi();

    const [seatMap, setSeatMap] = useState<SeatMap | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [initialLoading, setInitialLoading] = useState(true);

    const loadData = useCallback(async () => {
        if (!id) return;
        const data = await fetchSeatMap(id);
        if (data) {
            setSeatMap(data);
            // Clean up selected seats if they become booked remotely
            setSelectedSeats(prev => prev.filter(s => !data.booked.includes(s)));
        }
    }, [id, fetchSeatMap]);

    useEffect(() => {
        const init = async () => {
            await loadData();
            setInitialLoading(false);
        };
        init();

        const interval = setInterval(loadData, 5000);
        return () => clearInterval(interval);
    }, [loadData]);

    // Hook for Optimistic UI
    // Note: we wrap bookSeats to match the hook's signature if needed, or pass directly
    const { optimisticBookedSeats, handleBook: triggerOptimisticBook, isSubmitting, error: optimisticError }
        = useOptimisticBooking(
            seatMap?.booked || [],
            (seats) => bookSeats(id!, seats)
        );

    const handleConfirm = async () => {
        if (!id || selectedSeats.length === 0) return;

        setSubmitStatus(null);
        const success = await triggerOptimisticBook(selectedSeats);

        if (success) {
            setSubmitStatus({ type: 'success', message: 'Booking confirmed successfully!' });
            setSelectedSeats([]);
            await loadData(); // Fetch definitive state
        } else {
            // Error handling is partly in hook (state revert), but we can show message here too
            setSubmitStatus({
                type: 'error',
                message: optimisticError || 'Booking failed. Some seats may have been taken.'
            });
        }
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!seatMap) {
        return (
            <div className="text-center py-10">
                <h2 className="text-xl font-bold text-gray-900">Show not found or error loading data.</h2>
                <Link to="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="pb-24">
            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Select Seats</h1>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="flex items-center"><div className="w-3 h-3 bg-white border border-gray-300 rounded-sm mr-2"></div> Available</div>
                        <div className="flex items-center"><div className="w-3 h-3 bg-indigo-600 rounded-sm mr-2"></div> Selected</div>
                        <div className="flex items-center"><div className="w-3 h-3 bg-gray-300 rounded-sm mr-2"></div> Booked</div>
                    </div>
                </div>

                {submitStatus && (
                    <div className={`mx-6 mt-6 p-4 rounded-md flex items-start ${submitStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        <AlertCircle className={`w-5 h-5 mr-2 flex-shrink-0 ${submitStatus.type === 'success' ? 'text-green-500' : 'text-red-500'}`} />
                        <p>{submitStatus.message}</p>
                    </div>
                )}

                <div className="p-6">
                    <div className="mb-4 text-center">
                        <div className="w-3/4 h-2 bg-gray-300 mx-auto rounded-lg mb-2"></div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">Screen</p>
                    </div>

                    <SeatGrid
                        totalSeats={seatMap.total}
                        bookedSeats={optimisticBookedSeats} // Use optimistic data here
                        selectedSeats={selectedSeats}
                        onSelectionChange={setSelectedSeats}
                    />
                </div>
            </div>

            <BookingSummary
                selectedCount={selectedSeats.length}
                onConfirm={handleConfirm}
                isSubmitting={isSubmitting} // Use optimistic submitting state
            />
        </div>
    );
}
