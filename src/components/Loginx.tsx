'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAdminLogin } from '../hooks/useAdminLogin';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { handleAdminLogin } = useAdminLogin();

    const handleSubmit = () => {
        if (!username.trim() || !password.trim()) {
            toast.error('Please fill in both username and password');
            return;
        }
        handleAdminLogin(username, password);
    };

    return (
        <div className="min-h-screen flex bg-base-100">
            {/* Left column: image background */}
            <div className="hidden md:flex flex-1 min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/images/root.jpg)' }}>
                <div className="flex flex-col justify-center items-center w-full p-10 backdrop-blur"></div>
            </div>

            {/* Right column: login form */}
            <div className="flex flex-col justify-center flex-1 max-w-md p-10">
                <h1 className="text-3xl font-extrabold mb-10 text-center text-primary tracking-tight">
                    ADMIN<span className="text-secondary ms-2">PANEL</span>
                </h1>

                <div className="space-y-6">
                    {/* Username */}
                    <div className="form-control">
                        <label htmlFor="username" className="label">
                            <span className="label-text font-semibold text-primary mb-0.5">Username</span>
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            className="input input-bordered w-full py-3 text-base focus:outline-none"
                            required
                            autoComplete="username"
                        />
                    </div>

                    {/* Password */}
                    <div className="form-control">
                        <label htmlFor="password" className="label">
                            <span className="label-text font-semibold text-primary mb-0.5">Password</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="input input-bordered w-full py-3 text-base focus:outline-none"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" onClick={handleSubmit} className="btn btn-primary w-full rounded">
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}