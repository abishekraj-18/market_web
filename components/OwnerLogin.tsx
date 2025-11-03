
import React, { useState } from 'react';

interface OwnerLoginProps {
    onLoginSuccess: () => void;
}

const OwnerLogin: React.FC<OwnerLoginProps> = ({ onLoginSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would be a secure API call.
        // For this demo, we use a simple hardcoded password.
        if (password === 'admin123') {
            onLoginSuccess();
        } else {
            setError('Incorrect password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800">Owner Portal Login</h2>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                            placeholder="Enter owner password"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 text-white bg-sky-600 rounded-md font-semibold hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
                 <p className="text-center text-xs text-gray-500">Hint: The password is `admin123`</p>
            </div>
        </div>
    );
};

export default OwnerLogin;