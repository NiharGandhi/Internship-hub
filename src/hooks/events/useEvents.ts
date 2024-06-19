// hooks/useEvents.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Event {
    id: string;
    title: string;
    dateTime: string;
}

const useEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/api/events');
                setEvents(response.data);
            } catch (err) {
                setError('Error fetching Events data');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return { events, loading, error };
};

export default useEvents;
