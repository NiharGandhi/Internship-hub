// hooks/useEvents.ts
import { useEffect, useState } from 'react';
import axios from 'axios';


const useInternships = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/internshipsPage');
                setInternships(response.data);
            } catch (err) {
                setError('Error fetching Internships');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return { internships, loading, error };
};

export default useInternships;
