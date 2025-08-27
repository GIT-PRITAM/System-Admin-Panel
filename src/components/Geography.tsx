'use client';

// import LeafletMap from '@/app/components/Map';
// import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

type Block = { id: number; name: string };
type GP = { id: number; name: string };
type Village = { id: number; name: string };

export default function LocationPage() {
    const { token } = useAuth();
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [gps, setGPs] = useState<GP[]>([]);
    const [villages, setVillages] = useState<Village[]>([]);

    const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
    const [selectedGP, setSelectedGP] = useState<number | null>(null);

    const [selectedVillageId, setSelectedVillageId] = useState<number | null>(null);
    const [villageAssets, setVillageAssets] = useState<any[]>([]);
    const [loadingAssets, setLoadingAssets] = useState(false);
    const [location, setLocation] = useState<{ lat: number; lng: number; label: string }[]>([]);

    const [loading, setLoading] = useState({
        blocks: false,
        gps: false,
        villages: false,
    });

    // Modal controls & input states
    const [modalType, setModalType] = useState<'block' | 'gp' | 'village' | null>(null);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        setLoading((prev) => ({ ...prev, blocks: true }));
        fetch('/api/location/block')
            .then((res) => res.json())
            .then(setBlocks)
            .finally(() => setLoading((prev) => ({ ...prev, blocks: false })));
    }, []);

    useEffect(() => {
        if (!selectedBlock) {
            setGPs([]);
            setSelectedGP(null);
            setVillages([]);
            return;
        }
        setLoading((prev) => ({ ...prev, gps: true }));
        fetch(`/api/location/gp?block_id=${selectedBlock}`)
            .then((res) => res.json())
            .then(setGPs)
            .finally(() => setLoading((prev) => ({ ...prev, gps: false })));
        setSelectedGP(null);
        setVillages([]);
    }, [selectedBlock]);

    useEffect(() => {
        if (!selectedGP) {
            setVillages([]);
            return;
        }
        setLoading((prev) => ({ ...prev, villages: true }));
        fetch(`/api/location/village?gp_id=${selectedGP}`)
            .then((res) => res.json())
            .then(setVillages)
            .finally(() => setLoading((prev) => ({ ...prev, villages: false })));
    }, [selectedGP]);

    useEffect(() => {
        if (!selectedVillageId) return;

        setLoadingAssets(true);
        fetch(`/api/location/village/${selectedVillageId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                const assets = data?.data || [];
                setVillageAssets(assets);

                // Convert to map marker format
                const locs = assets.map((asset: any) => ({
                    lat: asset.latitude,
                    lng: asset.longitude,
                    label: asset.landmark || `Asset ${asset.id}`,
                }));
                setLocation(locs);
            })
            .catch(() => toast.error('Failed to fetch village assets'))
            .finally(() => setLoadingAssets(false));
    }, [selectedVillageId]);

    const handleAdd = async () => {
        const trimmedName = newName.trim();
        if (!trimmedName) return toast.error('Name is required');

        if (modalType === 'block') {
            const res = await fetch('/api/location/block', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: trimmedName }),
            });
            if (res.ok) {
                const newBlock = await res.json();
                setBlocks((prev) => [...prev, newBlock]);
                toast.success('Block added');
                setModalType(null);
                setNewName('');
            } else {
                toast.error('Failed to add block');
            }
        } else if (modalType === 'gp') {
            if (!selectedBlock) return toast.error('Select a block first');
            const res = await fetch('/api/location/gp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: trimmedName, block_id: selectedBlock }),
            });
            if (res.ok) {
                const newGP = await res.json();
                setGPs((prev) => [...prev, newGP]);
                toast.success('GP added');
                setModalType(null);
                setNewName('');
            } else {
                toast.error('Failed to add GP');
            }
        } else if (modalType === 'village') {
            if (!selectedGP) return toast.error('Select a GP first');
            const res = await fetch('/api/location/village', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: trimmedName, gp_id: selectedGP }),
            });
            if (res.ok) {
                const newVillage = await res.json();
                setVillages((prev) => [...prev, newVillage]);
                toast.success('Village added');
                setModalType(null);
                setNewName('');
            } else {
                toast.error('Failed to add village');
            }
        }
    };

    // Simple button styles for reuse
    const btnClass = 'btn btn-primary rounded';

    return (
        <div className="p-6 mx-auto font-sans">
            <h1 className="text-3xl font-semibold flex items-center gap-3 mb-6">
                <span role="img" aria-label="location pin">
                    📍
                </span>{' '}
                Locations
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* LEFT COLUMN: Dropdowns */}
                <div>
                    {/* Block Select */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium mb-1">Block</label>
                        <div className="flex items-center gap-3">
                            <select className="select focus:outline-none" value={selectedBlock ?? ''} onChange={(e) => setSelectedBlock(Number(e.target.value))}>
                                <option value="" disabled>
                                    Select a block
                                </option>
                                {blocks.map((block) => (
                                    <option key={block.id} value={block.id}>
                                        {block.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                className={btnClass}
                                onClick={() => {
                                    setModalType('block');
                                    setNewName('');
                                }}
                            >
                                + Add
                            </button>
                        </div>
                    </div>

                    {/* GP Select */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium mb-1">Gram Panchayat (GP)</label>
                        <div className="flex items-center gap-3">
                            <select
                                className="select focus:outline-none"
                                value={selectedGP ?? ''}
                                onChange={(e) => setSelectedGP(Number(e.target.value))}
                                disabled={!selectedBlock}
                            >
                                <option value="" disabled>
                                    {selectedBlock ? 'Select a GP' : 'Select a block first'}
                                </option>
                                {gps.map((gp) => (
                                    <option key={gp.id} value={gp.id}>
                                        {gp.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                className={`${btnClass} ${!selectedBlock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => {
                                    if (!selectedBlock) return;
                                    setModalType('gp');
                                    setNewName('');
                                }}
                                disabled={!selectedBlock}
                            >
                                + Add
                            </button>
                        </div>
                    </div>

                    {/* Village Select */}
                    <div className="mb-6">
                        <label className="block text-lg font-medium mb-1">Village</label>
                        <div className="flex items-center gap-3">
                            <select
                                className="select focus:outline-none"
                                value={villages.find((v) => v.id === selectedVillageId) ? selectedVillageId ?? '' : ''}
                                onChange={(e) => {
                                    const id = Number(e.target.value);
                                    setSelectedVillageId(id);
                                }}
                                disabled={!selectedGP}
                            >
                                <option value="" disabled>
                                    {selectedGP ? 'Select a village' : 'Select a GP first'}
                                </option>
                                {villages.map((village) => (
                                    <option key={village.id} value={village.id}>
                                        {village.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                className={`${btnClass} ${!selectedGP ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => {
                                    if (!selectedGP) return;
                                    setModalType('village');
                                    setNewName('');
                                }}
                                disabled={!selectedGP}
                            >
                                + Add
                            </button>
                        </div>
                    </div>

                    <ul className="list bg-base-100 rounded-box shadow-md">
                        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Assets</li>

                        {loadingAssets ? (
                            <p className="text-gray-500 dark:text-gray-400">Loading assets...</p>
                        ) : villageAssets.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                                {villageAssets.map((asset, idx) => (
                                    <li key={idx} className="list-row">
                                        <div>
                                            <label className="text-3xl">{asset.asset_type.icon}</label>
                                        </div>
                                        <div>
                                            <div>{asset.asset_type.label}</div>
                                            <div className="text-xs uppercase font-semibold opacity-60">{asset.landmark}</div>
                                        </div>
                                        {asset.condition === 'GOOD' ? (
                                            <div className="badge badge-success">{asset.condition}</div>
                                        ) : (
                                            <div className="badge badge-neutral">{asset.condition}</div>
                                        )}
                                        <button className="btn btn-square btn-ghost"></button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="p-6 text-gray-500 dark:text-gray-400">No assets found for this village.</p>
                        )}
                    </ul>
                </div>

                {/* RIGHT COLUMN: Map Preview */}
                <div className="p-6 bg-base-100">
                    <h2 className="text-xl font-semibold mb-4">Map Preview</h2>
                    {selectedVillageId ? (
                        <div>
                            <p>
                                <strong>Selected Village:</strong> {villages.find((v) => v.id === selectedVillageId)?.name}
                            </p>

                            <div className="mt-4 flex items-center justify-center">
                                {/* Placeholder Map */}
                                {/* <LeafletMap locations={location} /> */}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">Select a village to view map and assets.</p>
                    )}
                </div>
            </div>

            {/* Modal */}
            {modalType && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
                    <div
                        className="bg-white dark:bg-gray-900 rounded-md shadow-lg p-6 w-full max-w-sm
            text-gray-900 dark:text-gray-100"
                    >
                        <h3 id="modalTitle" className="text-lg font-semibold mb-4 capitalize">
                            Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                        </h3>
                        <input
                            type="text"
                            placeholder={`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} Name`}
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-4
              focus:outline-none focus:ring-2 focus:ring-blue-400
              dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100
              dark:focus:ring-blue-600"
                            autoFocus
                        />

                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100
                focus:outline-none dark:border-gray-600 dark:hover:bg-gray-700"
                                onClick={() => setModalType(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-blue-400
                dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-600"
                                onClick={handleAdd}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}