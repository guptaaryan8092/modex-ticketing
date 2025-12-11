import { Link } from 'react-router-dom';
import { useShows } from '../contexts/ShowsContext';
import { Calendar, Users } from 'lucide-react';

export default function Home() {
    const { shows, loading } = useShows();

    if (loading) {
        return (
            <div className="px-4 py-6 sm:px-0">
                <div className="h-8 w-48 bg-gray-200 rounded mb-8 animate-pulse"></div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white overflow-hidden shadow rounded-lg h-48 animate-pulse">
                            <div className="px-4 py-5 sm:p-6 space-y-4">
                                <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                                </div>
                                <div className="h-10 w-full bg-gray-200 rounded mt-4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Shows</h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {shows.map((show) => (
                    <div key={show.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                                {show.name}
                            </h3>
                            <div className="mt-2 text-sm text-gray-500 space-y-2">
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {new Date(show.start_time).toLocaleString()}
                                </div>
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-2" />
                                    {show.available_seats} / {show.total_seats} seats available
                                </div>
                            </div>
                            <div className="mt-5">
                                <Link
                                    to={`/booking/${show.id}`}
                                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                                >
                                    Book Tickets
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
                {shows.length === 0 && (
                    <div className="col-span-full text-center text-gray-500">
                        No shows available. ask admin to create one.
                    </div>
                )}
            </div>
        </div>
    );
}
