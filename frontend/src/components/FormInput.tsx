import type { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    name: string; // Enforce name for easy handling
}

export const FormInput = ({ label, error, className = '', ...props }: FormInputProps) => {
    return (
        <div className="mb-4">
            <label htmlFor={props.name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                id={props.name}
                className={`
            appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
            ${error ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
            ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};
