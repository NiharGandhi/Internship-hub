// hooks/useEvents.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Resource {
    id: string;
    name: string;
    desc: string;
    link: string;
}

const useOnlineResources = () => {
    const [onlineResources, setOnlineResources] = useState<Resource[]>([]);
    const [loadingRes, setLoadingRes] = useState<boolean>(true);
    const [errorRes, setErrorRes] = useState<string | null>(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await axios.get('/api/onlineResources');
                setOnlineResources(response.data);
            } catch (err) {
                setErrorRes('Error fetching Resources data');
            } finally {
                setLoadingRes(false);
            }
        };
        fetchResources();
    }, []);

    return { onlineResources, loadingRes, errorRes };
};

export default useOnlineResources;
