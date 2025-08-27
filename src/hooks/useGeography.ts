// hooks/useGeography.ts
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { geographyService } from '../service/geographyService';
import type { Block } from '../types/block';

export function useGeography() {
    const [blocks, setBlocks] = useState<Block[]>([]);

    const fetchBlocks = useCallback(async () => {
        const response = await toast.promise(geographyService.getBlocks(),
            {
                loading: 'Loading...',
                success: 'Block fetched successfully',
                error: (err) => err.message || 'Failed to fetch',
            }
        );
        setBlocks(response ?? []);
    }, []);

    useEffect(() => {
        fetchBlocks();
    }, [fetchBlocks]);

    return { fetchBlocks, blocks };
}
