import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const from = (location.state as any)?.from || "/dashboard";
            navigate(from, { replace: true });
        }
    }, [location.state, navigate]);

    const validateUsername = (uname: string) => /^\d{10}$/.test(uname);

    const validatePassword = (pass: string) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
        return regex.test(pass);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // if (!validateUsername(username)) {
        //     setError("Username must be a 10-digit number.");
        //     return;
        // }

        // if (!validatePassword(password)) {
        //     setError(
        //         "Password must be at least 6 characters and contain letters, numbers, and special characters."
        //     );
        //     return;
        // }

        const success = login(username, password);

        toast.promise(success, {
            loading: 'Loading',
            success: (data) => `Login Success !`,
            error: (err) => `${err.message || "Login failed"}`,
        })

    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username (10 digits)"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-all"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
