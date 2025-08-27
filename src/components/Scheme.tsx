'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/16/solid';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_SERVER_URL;

type Scheme = {
    id: string;
    scheme_name: string;
    orders: { id: string }[];
};

export default function SchemesPage() {
    const { token } = useAuth();
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [loading, setLoading] = useState(true);
    const [newScheme, setNewScheme] = useState('');

    // Fetch schemes
    const fetchSchemes = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/schemes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (data.status) {
                setSchemes(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Failed to fetch schemes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchemes();
    }, []);

    const handleAdd = async () => {
        if (!newScheme.trim()) return;

        const promise = fetch(`${API_URL}/schemes`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newScheme }),
        }).then(async (res) => {
            const data = await res.json();
            if (!data.status) {
                throw new Error(data.message);
            }

            setNewScheme('');
            setSchemes((prev) => [...prev, data.data]); // ✅ Append new scheme
            return data.message;
        });

        toast.promise(promise, {
            loading: 'Adding scheme...',
            success: (msg) => msg || 'Scheme added successfully!',
            error: (err) => err.message || 'Failed to add scheme',
        });
    };

    return (
        <>
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center text-primary justify-center">
                    <DocumentTextIcon className="size-6 mr-4" />
                    <span className="text-2xl font-bold">Schemes</span>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Enter scheme name"
                        className="input input-md w-64 input-bordered focus:outline-none "
                        value={newScheme}
                        onChange={(e) => setNewScheme(e.target.value)}
                    />
                    <button onClick={handleAdd} className="btn btn-primary rounded">
                        <PlusIcon className="size-6" />
                        Add
                    </button>
                </div>
            </div>
            <div className="divider" />
            <div className="p-4">
                {loading ? (
                    <div className="text-center py-10">Loading schemes...</div>
                ) : schemes.length === 0 ? (
                    <div className="text-gray-500">No schemes found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {schemes.map((scheme) => (
                            <Link to={`/schemes/${scheme.id}`} key={scheme.id} className="card card-dash bg-base-100 transition shadow">
                                <div className="card-body">
                                    <h3 className="card-title text-lg font-semibold">{scheme.scheme_name}</h3>

                                    <div className="text-sm text-gray-500 flex items-center justify-between mt-2">
                                        <span>Work Orders:</span>
                                        <div className="badge badge-outline badge-primary">{scheme.orders.length}</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}