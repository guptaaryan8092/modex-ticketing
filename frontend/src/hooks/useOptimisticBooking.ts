import { useState, useEffect } from 'react';

// Returns optimistic state and a book handler
export const useOptimisticBooking = (
    currentBookedSeats: number[],
    apiBookFn: (seats: number[]) => Promise<{ status: 'success' | 'error', booking?: any }>
) => {
    const [optimisticBookedSeats, setOptimisticBookedSeats] = useState<number[]>(currentBookedSeats);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sync when server data updates (e.g. polling puts new booked seats)
    useEffect(() => {
        setOptimisticBookedSeats(currentBookedSeats);
    }, [currentBookedSeats]);

    const handleBook = async (seatsToBook: number[]) => {
        setIsSubmitting(true);
        setError(null);

        // Optimistic Update: Immediately mark as booked
        const prevBooked = [...optimisticBookedSeats];
        setOptimisticBookedSeats([...prevBooked, ...seatsToBook]);

        try {
            const result = await apiBookFn(seatsToBook);
            if (result.status === 'error') {
                throw new Error('Booking failed');
            }
            // Success: No need to revert. The polling or parent refresh will eventually update truth.
            return true;
        } catch (err) {
            // Revert on failure
            setOptimisticBookedSeats(prevBooked);
            setError('Booking failed. Please try again.');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        optimisticBookedSeats,
        handleBook,
        isSubmitting,
        error
    };
};
