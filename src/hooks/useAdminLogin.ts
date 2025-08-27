import { useAuth } from '../context/AuthContext';
import { adminLogin } from '../service/authService';
import toast from 'react-hot-toast';

export function useAdminLogin() {
    const { login } = useAuth();

    const handleAdminLogin = async (phone: string, password: string) => {
        const promise = adminLogin(phone, password).then((data) => {
            // if (data.user.role !== 'ADMIN') {
            //     throw new Error('You are not authorized to access this page');
            // }

            login({
                token: data.token,
                user: data.user,
                // school: data.school,
            });

            return 'Login successful!';
        });

        return toast.promise(promise, {
            loading: 'Logging in...',
            success: (msg) => msg,
            error: (err) => err.message || 'Failed to login',
        });
    };

    return { handleAdminLogin };
}