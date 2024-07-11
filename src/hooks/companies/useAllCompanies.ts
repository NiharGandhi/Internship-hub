// hooks/useEvents.ts
import { useEffect, useState } from 'react';
import axios from 'axios';


const useAllOrganizations = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/allOrganizations');
                setOrganizations(response.data);
            } catch (err) {
                console.log(err);
                setError('Error fetching Organizations');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return { organizations, loading, error };
};

export default useAllOrganizations;
