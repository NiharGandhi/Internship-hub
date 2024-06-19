// hooks/useEvents.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Resource {
    id: string;
    name: string;
    desc: string;
    link: string;
}

const useUsefulTool = () => {
    const [usefulTools, setUsefulTools] = useState<Resource[]>([]);
    const [loadingTools, setLoadingTools] = useState<boolean>(true);
    const [errorTools, setErrorTools] = useState<string | null>(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await axios.get('/api/usefulTools');
                setUsefulTools(response.data);
                // console.log(response.data);
            } catch (err) {
                setErrorTools('Error fetching Resources data');
            } finally {
                setLoadingTools(false);
            }
        };
        fetchResources();
    }, []);

    return { usefulTools, loadingTools, errorTools };
};

export default useUsefulTool;
