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
    refreshShows: () => Promise<void>;
}

const ShowsContext = createContext<ShowsContextType | undefined>(undefined);

export const ShowsProvider = ({ children }: { children: ReactNode }) => {
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(false);

    const refreshShows = async () => {
        setLoading(true);
        try {
            const response = await api.get('/shows');
            setShows(response.data);
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
