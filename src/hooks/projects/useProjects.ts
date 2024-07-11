import { useEffect, useState } from 'react';
import axios from 'axios';


const useAllProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/allProjects');
                setProjects(response.data);
            } catch (err) {
                setError('Error fetching Projects' + err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return { projects, loading, error };
};

export default useAllProjects;
