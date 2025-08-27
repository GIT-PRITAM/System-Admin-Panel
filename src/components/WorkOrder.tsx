'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/16/solid';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_SERVER_URL;


type WorkOrder = {
    id: string;
    order_id: string;
    order_amount: number;
    issue_date: string;
};

export default function SchemeDetailPage() {
    const { schemeId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();

    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [loading, setLoading] = useState(true);

    const [orderId, setOrderId] = useState('');
    const [orderAmount, setOrderAmount] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchWorkOrders = async () => {
            try {
                const res = await fetch(`${API_URL}/schemes/${schemeId}/work_orders`, {
                    headers: {
                        Authorization: `Bearer ${token}` || '',
                    },
                });
                const data = await res.json();
                if (!res.ok) {
                    toast.error(data.message || 'Failed to fetch work orders');
                } else {
                    setWorkOrders(data.data);
                }
            } catch {
                toast.error('Failed to fetch work orders');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkOrders();
    }, [schemeId]);

    const handleAdd = async () => {
        if (!orderId || !orderAmount || !issueDate) {
            toast.error('All fields are required.');
            return;
        }
        setAdding(true);
        try {
            const res = await fetch(`${API_URL}/schemes/${schemeId}/work_orders`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}` || '',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_id: orderId,
                    order_amount: Number(orderAmount),
                    issue_date: issueDate,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message);
            } else {
                setWorkOrders((prev) => [...prev, data.data]);
                setOrderId('');
                setOrderAmount('');
                setIssueDate('');
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setAdding(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center justify-center gap-2">
                    <button className="btn btn-ghost" onClick={() => navigate(-1)}>
                        <ArrowLeftIcon className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-bold">Work Orders</span>
                </div>
                <button className="btn btn-primary rounded">
                    <PlusIcon className="size-6" />
                    Work Order
                </button>
            </div>
            <div className="divider" />

            <div className="p-4 mx-auto">
                <div className="card bg-base-200 shadow p-4 mb-6">
                    <h3 className="text-lg font-semibold mb-3">Add Work Order</h3>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <input
                            type="text"
                            placeholder="Order ID"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="input focus:outline-none  flex-grow"
                            disabled={adding}
                        />
                        <input
                            type="number"
                            placeholder="Amount (₹)"
                            value={orderAmount}
                            onChange={(e) => setOrderAmount(e.target.value)}
                            className="input focus:outline-none flex-grow"
                            disabled={adding}
                        />
                        <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="input focus:outline-none flex-grow" disabled={adding} />
                        <button
                            onClick={handleAdd}
                            className={`btn btn-primary rounded w-full sm:w-auto ${adding ? 'loading' : ''}`}
                            disabled={adding}
                            style={{ minWidth: '120px' }}
                        >
                            {adding ? 'Adding...' : 'Add'}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500 py-8">Loading work orders...</div>
                ) : workOrders.length === 0 ? (
                    <div className="text-gray-500 italic">No work orders found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {workOrders.map((wo) => (
                            <div key={wo.id} className="card bg-base-200 shadow p-4">
                                <h4 className="text-lg font-semibold text-primary">{wo.order_id}</h4>
                                <p className="text-sm">Amount: ₹{wo.order_amount.toLocaleString()}</p>
                                <p className="text-sm">Issued: {new Date(wo.issue_date).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}