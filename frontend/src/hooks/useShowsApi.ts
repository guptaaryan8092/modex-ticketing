import { useState, useCallback } from 'react';
import { api } from '../contexts/ShowsContext';
import type { Show, SeatMap, Booking } from '../types';

export const useShowsApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchShows = useCallback(async (): Promise<Show[]> => {
        setLoading(true);
        try {
            const response = await api.get('/shows');
            return response.data;
        } catch (err) {
            setError('Failed to fetch shows');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSeatMap = useCallback(async (showId: string): Promise<SeatMap | null> => {
        setLoading(true);
        try {
            const response = await api.get(`/shows/${showId}/seats`);
            return response.data;
        } catch (err) {
            setError('Failed to fetch seat map');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const bookSeats = useCallback(async (showId: string, seats: number[]): Promise<{ status: 'success' | 'error'; booking?: Booking }> => {
        setLoading(true);
        try {
            const response = await api.post(`/shows/${showId}/book`, { seats });
            return { status: 'success', booking: response.data };
        } catch (err: any) {
            const msg = err.response?.data?.error || 'Booking failed';
            setError(msg);
            return { status: 'error' };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        fetchShows,
        fetchSeatMap,
        bookSeats
    };
};
