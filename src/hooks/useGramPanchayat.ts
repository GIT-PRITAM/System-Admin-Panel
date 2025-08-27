// hooks/useGramPanchayats.ts
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { geographyService } from '../service/geographyService';
import type { GramPanchayat } from '../types/gp';

export function useGramPanchayats(blockId: string | undefined) {
    const [gramPanchayats, setGramPanchayats] = useState<GramPanchayat[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!blockId) return;

        const fetchGPs = async () => {
            setLoading(true);
            const response = await toast.promise(
                geographyService.getGramPanchayats(blockId),
                {
                    loading: 'Loading Gram Panchayats...',
                    success: 'Gram Panchayats fetched successfully',
                    error: (err) => err.message || 'Failed to fetch GPs',
                }
            );

            setGramPanchayats(response.panchayats ?? []);
            setLoading(false);
        };

        fetchGPs();
    }, [blockId]);

    return { gramPanchayats, loading };
}
