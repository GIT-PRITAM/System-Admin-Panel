'use client';

import { useGeography } from '../hooks/useGeography';
import { useGramPanchayats } from '../hooks/useGramPanchayat';
import { useState } from 'react';
import LeafletMap from './Map';

export default function LocationPage() {
    const { blocks } = useGeography();
    const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>();
    const { gramPanchayats } = useGramPanchayats(selectedBlockId);
    const [selectedGpId, setSelectedGpId] = useState<string | undefined>();

    const [location] = useState<{ lat: number; lng: number; label: string }[]>([]);

    return (
        <div className="p-6 space-y-6">
            <div className="text-2xl font-bold text-primary mb-4">Geography</div>

            {/* Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Left Panel - Block Select */}
                <div className="col-span-1 bg-base-200 p-4 rounded-box">
                    <h2 className="font-bold mb-2">Select Block</h2>
                    <select
                        className="select select-bordered w-full"
                        value={selectedBlockId}
                        onChange={(e) => setSelectedBlockId(e.target.value)}
                    >
                        <option value="">-- Select Block --</option>
                        {blocks.map((block) => (
                            <option key={block.id} value={block.id}>
                                {block.name}
                            </option>
                        ))}
                    </select>

                    <h2 className="font-bold mt-2 mb-2">Select GP</h2>
                    <select
                        className="select select-bordered w-full"
                        value={selectedGpId}
                        onChange={(e) => setSelectedGpId(e.target.value)}
                    >
                        <option value="">-- Select GP --</option>
                        {gramPanchayats.map((gp) => (
                            <option key={gp.id} value={gp.id}>
                                {gp.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Right Panel - Gram Panchayats */}
                <div className="col-span-1 md:col-span-3 bg-base-100 p-6 rounded-box shadow-md">
                    <LeafletMap locations={location} />
                </div>
            </div>
        </div>
    );
}
