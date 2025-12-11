import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import type { Show } from '../types';

// Configure Axios base URL
const api = axios.create({
    baseURL: 'http://localhost:3000',
});

interface ShowsContextType {
    shows: Show[];
    loading: boolean;
    refreshShows: (force?: boolean) => Promise<void>;
}

const ShowsContext = createContext<ShowsContextType | undefined>(undefined);

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const ShowsProvider = ({ children }: { children: ReactNode }) => {
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastFetched, setLastFetched] = useState<number>(0);

    const refreshShows = async (force = false) => {
        const now = Date.now();
        // Skip if not forced, we have data, and cache is fresh
        if (!force && shows.length > 0 && (now - lastFetched < CACHE_DURATION)) {
            return;
        }

        setLoading(true);
        try {
            const response = await api.get('/shows');
            setShows(response.data);
            setLastFetched(now);
        } catch (error) {
            console.error('Failed to fetch shows:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshShows();
    }, []);

    return (
        <ShowsContext.Provider value={{ shows, loading, refreshShows }}>
            {children}
        </ShowsContext.Provider>
    );
};

export const useShows = () => {
    const context = useContext(ShowsContext);
    if (context === undefined) {
        throw new Error('useShows must be used within a ShowsProvider');
    }
    return context;
};

export { api };
