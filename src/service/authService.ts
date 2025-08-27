const API_URL = import.meta.env.VITE_SERVER_URL;

export async function adminLogin(phone: string, password: string) {
    const res = await fetch(`${API_URL}/login/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.data?.details || 'Failed to login');
    }

    return json.data;
}