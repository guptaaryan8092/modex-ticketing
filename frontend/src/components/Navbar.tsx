import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Ticket, LogIn, LogOut, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
    const { isAuthenticated, login, logout, user } = useAuth();

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <Ticket className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">TixBook</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/admin" className="text-gray-600 hover:text-gray-900 flex items-center">
                                    <LayoutDashboard className="w-5 h-5 mr-1" />
                                    Admin
                                </Link>
                                <div className="flex items-center">
                                    <span className="mr-4 text-sm text-gray-500">Hi, {user?.name}</span>
                                    <button
                                        onClick={logout}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={login}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <LogIn className="w-4 h-4 mr-2" />
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
