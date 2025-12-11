export interface Show {
    id: string;
    name: string;
    start_time: string;
    total_seats: number;
    available_seats?: number;
}

export interface Booking {
    id: string;
    show_id: string;
    seats_requested: number;
    seats_assigned: number[] | null;
    status: 'PENDING' | 'CONFIRMED' | 'FAILED';
    createdAt: string;
}

export interface User {
    id: string;
    name: string;
    role: 'admin' | 'user';
}

export interface SeatMap {
    total: number;
    booked: number[];
    available: number[];
}
