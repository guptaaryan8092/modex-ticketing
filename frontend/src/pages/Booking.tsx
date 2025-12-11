import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../contexts/ShowsContext';
import type { SeatMap } from '../types';

export default function Booking() {
    const { id } = useParams<{ id: string }>();
    const [seatMap, setSeatMap] = useState<SeatMap | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        fetchSeatMap();
        // Poll every 5s for updates (optional for phase 1 but nice)
        const interval = setInterval(fetchSeatMap, 5000);
        return () => clearInterval(interval);
    }, [id]);

    const fetchSeatMap = async () => {
        try {
            const res = await api.get(`/shows/${id}/seats`);
            setSeatMap(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSeatClick = (seatNum: number) => {
        if (seatMap?.booked.includes(seatNum)) return;

        setSelectedSeats(prev =>
            prev.includes(seatNum)
                ? prev.filter(s => s !== seatNum)
                : [...prev, seatNum]
        );
    };

    const handleBook = async () => {
        if (selectedSeats.length === 0) return;
        try {
            await api.post(`/shows/${id}/book`, { seats: selectedSeats });
            setBookingStatus('success');
            setSelectedSeats([]);
            fetchSeatMap();
        } catch (error) {
            console.error(error);
            setBookingStatus('error');
        }
    };

    if (loading || !seatMap) return <div className="text-center py-10">Loading seat map...</div>;

    // Simple grid layout for seats
    const seats = Array.from({ length: seatMap.total }, (_, i) => i + 1);

    return (
        <div className="bg-white shadow sm:rounded-lg p-6">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Select Seats</h2>
                <Link to="/" className="text-indigo-600 hover:text-indigo-900">Back to Shows</Link>
            </div>

            {bookingStatus === 'success' && (
                <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
                    Booking confirmed!
                </div>
            )}
            {bookingStatus === 'error' && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                    Booking failed. Seats might have been taken.
                </div>
            )}

            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-8">
                {seats.map(seat => {
                    const isBooked = seatMap.booked.includes(seat);
                    const isSelected = selectedSeats.includes(seat);
                    return (
                        <button
                            key={seat}
                            disabled={isBooked}
                            onClick={() => handleSeatClick(seat)}
                            className={`
                        h-10 w-full rounded-md font-medium text-sm transition-colors
                        ${isBooked
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : isSelected
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }
                    `}
                        >
                            {seat}
                        </button>
                    )
                })}
            </div>

            <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="font-medium">{selectedSeats.length}</span> seats selected
                    </div>
                    <button
                        onClick={handleBook}
                        disabled={selectedSeats.length === 0}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    >
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    );
}
