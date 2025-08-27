// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";

interface User {
    name: string;
    role: string;
}


interface AuthData {
    token: string;
    user: User;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (data: AuthData) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load from localStorage on mount
    useEffect(() => {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
            const parsed = JSON.parse(storedAuth);
            setUser(parsed.user);
            setToken(parsed.token);
        }
        setLoading(false);
    }, []);

    const login = (data: AuthData) => {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("auth", JSON.stringify(data));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("auth");
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}