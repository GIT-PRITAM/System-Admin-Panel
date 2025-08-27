import type { Block } from "../types/block";


const API_URL = import.meta.env.VITE_SERVER_URL;

export const geographyService = {

    async getBlocks(): Promise<Block[]> {
        const response = await fetch(`${API_URL}/geography/district`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const json = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to fetch courses: ${response.statusText}`);
        }

        return json as Block[];
    },

    getGramPanchayats: async (blockId: string) => {
        // Replace with your actual API call
        const response = await fetch(`${API_URL}/geography/block/${blockId}`);
        if (!response.ok) throw new Error('Failed to fetch Gram Panchayats');
        return response.json();
    }

}