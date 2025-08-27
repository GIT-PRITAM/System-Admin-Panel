import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import LoginPage from "../components/Loginx";
import Sidebar from "../components/SideBar2";

export default function AuthGate({ children }: { children: ReactNode }) {
    const { user, loading, logout } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) return <LoginPage />;

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <main className="flex-1 transition-margin duration-300 ml-16 md:ml-64 bg-base-100 min-h-screen">
                {/* Top bar */}
                <header className="navbar shadow-sm p-4 bg-base-300 text-base-content flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {/* School name */}
                        <span className="text-lg font-bold">Panel</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* User name */}
                        <span className="font-semibold">{user?.name}</span>

                        {/* Logout button */}
                        <button
                            className="btn btn-sm btn-error text-white"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Dashed content area */}
                <section className="m-6 rounded-lg min-h-[80vh] bg-base-300">
                    {children}
                </section>
            </main>
        </div>
    );
}