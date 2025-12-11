import { useState, type FormEvent, useEffect } from 'react';
import { useShows, api } from '../contexts/ShowsContext';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { FormInput } from '../components/FormInput';
import { Trash2, Edit2, Calendar, Users, Plus } from 'lucide-react';

export default function Admin() {
    const { isAuthenticated, user } = useAuth();
    const { shows, refreshShows } = useShows();

    // Local state for list view handling (though Context has cached shows, we rely on it)
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        start_time: '',
        total_seats: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    if (!isAuthenticated || user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // Reload shows on mount to ensure freshness
    useEffect(() => {
        refreshShows();
    }, []);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) newErrors.name = 'Show name is required';

        if (!formData.start_time) {
            newErrors.start_time = 'Start time is required';
        } else {
            const date = new Date(formData.start_time);
            if (date < new Date()) {
                newErrors.start_time = 'Start time must be in the future';
            }
        }

        const seats = parseInt(formData.total_seats);
        if (!formData.total_seats || isNaN(seats)) {
            newErrors.total_seats = 'Total seats is required';
        } else if (seats < 1 || seats > 200) {
            newErrors.total_seats = 'Seats must be between 1 and 200';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCreateShow = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitMessage(null);

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await api.post('/admin/shows', {
                name: formData.name,
                start_time: new Date(formData.start_time).toISOString(),
                total_seats: parseInt(formData.total_seats)
            });

            setSubmitMessage({ type: 'success', text: 'Show created successfully!' });
            setFormData({ name: '', start_time: '', total_seats: '' }); // Reset form
            refreshShows(); // Update global list
        } catch (error) {
            console.error(error);
            setSubmitMessage({ type: 'error', text: 'Failed to create show. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRunExpiry = async () => {
        try {
            setSubmitMessage({ type: 'success', text: 'Running expiry job...' });
            const res = await api.post('/admin/run-expiry');
            setSubmitMessage({ type: 'success', text: `Expiry job run: ${res.data.expired_count} bookings expired.` });
        } catch (error) {
            setSubmitMessage({ type: 'error', text: 'Failed to run expiry job.' });
        }
    };

    const handleStubAction = (action: string) => {
        console.log(`${action} clicked - Stub functionality`);
        alert(`${action} is not implemented yet.`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
                <button
                    onClick={handleRunExpiry}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    Run Expiry Job
                </button>
            </div>

            {submitMessage && (
                <div className={`p-4 rounded-md flex items-center ${submitMessage.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    <span className="font-medium">{submitMessage.text}</span>
                </div>
            )}

            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                        <Plus className="w-5 h-5 mr-2" />
                        Create New Show
                    </h3>
                </div>
                <div className="p-6">
                    <form onSubmit={handleCreateShow}>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <FormInput
                                    label="Show Name"
                                    name="name"
                                    type="text"
                                    placeholder="e.g. Summer Concert"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={errors.name}
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <FormInput
                                    label="Start Time"
                                    name="start_time"
                                    type="datetime-local"
                                    value={formData.start_time}
                                    onChange={handleChange}
                                    error={errors.start_time}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <FormInput
                                    label="Total Seats"
                                    name="total_seats"
                                    type="number"
                                    min="1"
                                    max="200"
                                    value={formData.total_seats}
                                    onChange={handleChange}
                                    error={errors.total_seats}
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Show'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Manage Shows
                    </h3>
                </div>
                <ul className="divide-y divide-gray-200">
                    {shows.map((show) => (
                        <li key={show.id} className="hover:bg-gray-50 transition-colors">
                            <div className="px-6 py-4 flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-lg font-semibold text-gray-900 truncate">{show.name}</h4>
                                    <div className="mt-1 flex flex-col sm:flex-row sm:space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                            {new Date(show.start_time).toLocaleString()}
                                        </div>
                                        <div className="flex items-center mt-1 sm:mt-0">
                                            <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                            {show.total_seats} seats ({show.available_seats} available)
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleStubAction('Edit')}
                                        className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleStubAction('Delete')}
                                        className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                    {shows.length === 0 && (
                        <li className="px-6 py-8 text-center text-gray-500">
                            No shows found. Create one above!
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
