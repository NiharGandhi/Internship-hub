// hooks/useEvents.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '@/types/interfaces';


const useUser = () => {
    const [user, setUser] = useState<User | null>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/user');
                setUser(response.data);
            } catch (err) {
                setError('Error fetching Users');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return { user, loading, error };
};

export default useUser;
