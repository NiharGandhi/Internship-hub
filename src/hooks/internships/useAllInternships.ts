// hooks/useEvents.ts
import { useEffect, useState } from 'react';
import axios from 'axios';


const useAllInternships = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/allInternships');
                setInternships(response.data);
            } catch (err) {
                setError('Error fetching Users');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return { internships, loading, error };
};

export default useAllInternships;
