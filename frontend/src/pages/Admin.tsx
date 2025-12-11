import React, { useState } from 'react';
import { useShows, api } from '../contexts/ShowsContext';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Admin() {
    const { isAuthenticated, user } = useAuth();
    const { refreshShows } = useShows();
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [seats, setSeats] = useState(50);
    const [message, setMessage] = useState('');

    if (!isAuthenticated || user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const handleCreateShow = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/admin/shows', {
                name,
                start_time: new Date(date).toISOString(),
                total_seats: Number(seats)
            });
            setMessage('Show created successfully!');
            setName('');
            setDate('');
            refreshShows(); // Update global list
        } catch (error) {
            console.error(error);
            setMessage('Failed to create show.');
        }
    };

    const handleRunExpiry = async () => {
        try {
            const res = await api.post('/admin/run-expiry');
            setMessage(`Expiry job run: ${res.data.expired_count} bookings expired.`);
        } catch (error) {
            setMessage('Failed to run expiry job.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow sm:rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

            {message && (
                <div className={`p-4 mb-6 rounded-md ${message.includes('Failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {message}
                </div>
            )}

            <div className="mb-8 border-b pb-8">
                <h3 className="text-lg font-medium mb-4">Create New Show</h3>
                <form onSubmit={handleCreateShow} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Show Name</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-indigo-500 focus:ring-indigo-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input
                            type="datetime-local"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Total Seats</label>
                        <input
                            type="number"
                            required
                            min="1"
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                            value={seats}
                            onChange={(e) => setSeats(Number(e.target.value))}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Create Show
                    </button>
                </form>
            </div>

            <div>
                <h3 className="text-lg font-medium mb-4">Maintenance</h3>
                <button
                    onClick={handleRunExpiry}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    Run Booking Expiry Job Manually
                </button>
            </div>
        </div>
    );
}
