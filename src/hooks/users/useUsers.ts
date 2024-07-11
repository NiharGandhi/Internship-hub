// hooks/useEvents.ts
import { useEffect, useState } from 'react';
import axios from 'axios';


const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/allUsers');
                setUsers(response.data);
            } catch (err) {
                setError('Error fetching Users');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return { users, loading, error };
};

export default useUsers;
